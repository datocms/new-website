import { default as classNames, default as cn } from 'classnames';
import Button from 'components/Button';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import RcSwitch from 'rc-switch';
import LogosBar from 'components/LogosBar';
import Quote from 'components/Quote';
import Space from 'components/Space';
import { matchSorter } from 'match-sorter';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  formatLimitRaw,
  formatLimit,
  formatExtra,
  formatUpperBoundLimitRaw,
} from 'utils/planLimitsHelpers';
import {
  handleErrors,
  imageFields,
  request,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import SuccessIcon from 'public/icons/regular/check.svg';
import InfoCircleIcon from 'public/icons/regular/info-circle.svg';
import MinusCircleIcon from 'public/icons/regular/minus-circle.svg';
import ExclamationIcon from 'public/icons/regular/exclamation-triangle.svg';
import PlusCircleIcon from 'public/icons/regular/plus-circle.svg';
import SearchIcon from 'public/icons/regular/search.svg';
import NopeIcon from 'public/icons/regular/times.svg';
import CloseIcon from 'public/icons/regular/times-circle.svg';
import AnnouncementIcon from 'public/images/illustrations/marketers.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import { useEffect, useState } from 'react';
import { renderMetaTags, StructuredText } from 'react-datocms';
import tiny from 'tiny-json-http';
import formatNumber from 'utils/formatNumber';
import s from './style.module.css';
import Polestar from 'public/images/logos/polestar.svg';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    body: { data: datoPlans },
  } = await tiny.get({
    url: 'https://account-api.datocms.com/per-owner-pricing-plans',
    headers: { accept: 'application/json' },
  });

  const { data } = await request({
    query: `
      {
        page: pricingPage {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
        }
        faqs: allFaqs {
          id
          question
          answer { value }
        }
        planFeatureGroups: allPlanFeatureGroups(orderBy:position_ASC, first: 100) {
          id
          name
          features {
            id
            name
            description {
              value
            }
            tags
            availableOnProfessionalPlan
          }
        }
        hints: allPricingHints(first: 100) {
          apiId
          name
          description
          position
        }
        review1: review(filter: { name: { eq: "Tore Heimann" } }) {
          ...reviewFields
        }
      }
      ${imageFields}
      ${reviewFields}
      ${seoMetaTagsFields}
    `,
    preview,
  });

  return {
    props: {
      ...data,
      preview: preview || false,
      plans: datoPlans.sort(
        (a, b) => a.attributes.monthly_price - b.attributes.monthly_price,
      ),
    },
  };
});

const Check = () => (
  <div className={s.check}>
    <SuccessIcon />
  </div>
);

const Nope = () => (
  <div className={s.nope}>
    <NopeIcon />
  </div>
);

function ReadMore() {
  return (
    <div className={cn(s.planBullet, s.readMore)}>
      <div className={s.readMoreBulletIcon} />
      <Link href="#details" passHref>
        <a>Read all the details &raquo;</a>
      </Link>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div className={s.planBullet}>
      <div className={s.planBulletIcon}>
        <SuccessIcon />
      </div>
      {children}
    </div>
  );
}

function FreeLimitsTable({ hints, freePlan, proPlan }) {
  return (
    <table className={s.fTable}>
      <thead className={s.fReducedHead}>
        <th className={s.fReducedHeadTitle}>Limit</th>
        <th className={s.fReducedHeadPlan}>Free plan</th>
        <th className={s.fReducedHeadPlan}>Professional plan</th>
      </thead>
      <tbody>
        {[
          'users',
          'items',
          'uploadable_bytes',
          'indexable_pages',
          'history_retention_days',
          'traffic_bytes',
          'api_calls',
          'mux_encoding_seconds',
          'mux_streaming_seconds',
        ].map((limitId, i) => {
          const hint = hints.find((h) => h.apiId === limitId);

          if (!hint) return;

          const freePlanLimit = freePlan.attributes.limits.find(
            (l) => l.id === limitId,
          );

          const proPlanLimit = proPlan.attributes.limits.find(
            (l) => l.id === limitId,
          );

          return (
            <tr
              key={limitId.id}
              className={classNames(
                s.fTableFeature,
                i % 2 === 0 && s.fTableFeatureOdd,
              )}
            >
              <th className={s.fTableFeatureName}>
                <div className={s.fTableFeatureNameSplit}>
                  <div className={s.fTableFeatureNameName}>{hint.name} </div>
                  {hint.description && (
                    <div className={s.fTableFeatureNameInfo}>
                      <InfoCircleIcon />
                      <div className={s.fTableFeatureNameInfoHint}>
                        {hint.description}
                      </div>
                    </div>
                  )}
                </div>
              </th>
              <td className={s.fTableFeaturePlan}>
                {formatLimitRaw(freePlanLimit)}
              </td>

              <td className={s.fTableFeaturePlan}>
                {formatLimitRaw(proPlanLimit)}
                {proPlanLimit.extra_packet_amount && (
                  <div className={s.extra}>{formatExtra(proPlanLimit)}</div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function LimitsGroup({ proPlan, hints, forceOpen }) {
  const [isOpen, setOpen] = useState(true);

  const limits = [
    'users',
    'sites',
    'sandbox_environments',
    'locales',
    'item_types',
    'items',
    'uploadable_bytes',
    'maximum_single_upload_bytes',
    'indexable_pages',
    'history_retention_days',
    'traffic_bytes',
    'api_calls',
    'mux_encoding_seconds',
    'mux_streaming_seconds',
  ];

  return (
    <>
      <tr className={s.fTableGroup}>
        <td colSpan={3} onClick={() => setOpen((old) => !old)}>
          {isOpen || forceOpen ? (
            <MinusCircleIcon className={s.fTableGroupIcon} />
          ) : (
            <PlusCircleIcon className={s.fTableGroupIcon} />
          )}
          Limits{' '}
          {!isOpen && !forceOpen && (
            <span className={s.fTableGroupCount}>({limits.length})</span>
          )}
        </td>
      </tr>
      {(isOpen || forceOpen) &&
        limits.map((limitId, i) => {
          const hint = hints.find((h) => h.apiId === limitId);

          if (!hint) return;

          const proPlanLimit = proPlan.attributes.limits.find(
            (l) => l.id === limitId,
          );

          return (
            <tr
              key={limitId.id}
              className={classNames(
                s.fTableFeature,
                i % 2 === 0 && s.fTableFeatureOdd,
              )}
            >
              <th className={s.fTableFeatureName}>
                <div className={s.fTableFeatureNameSplit}>
                  <div className={s.fTableFeatureNameName}>{hint.name} </div>
                  {hint.description && (
                    <div className={s.fTableFeatureNameInfo}>
                      <InfoCircleIcon />
                      <div className={s.fTableFeatureNameInfoHint}>
                        {hint.description}
                      </div>
                    </div>
                  )}
                </div>
              </th>
              <td className={s.fTableFeaturePlan}>
                {formatLimit(proPlanLimit)}
                {/* {proPlanLimit.extra_packet_amount && <> included</>} */}

                {proPlanLimit.extra_packet_amount && (
                  <div className={s.extra}>
                    {formatExtra(proPlanLimit)}
                    {proPlanLimit.max_extra_packets && (
                      <>, up to {formatUpperBoundLimitRaw(proPlanLimit)}</>
                    )}
                  </div>
                )}
              </td>

              <td className={s.fTableFeaturePlan}>Custom</td>
            </tr>
          );
        })}
    </>
  );
}

function FeatureGroup({ group, searchTerm, startOpen, onlyShowDifferences }) {
  const normalizedSearchTerm = searchTerm.trim();

  const [isOpen, setOpen] = useState(startOpen);

  const augmentedFeatures = group.features.map((f) => ({
    ...f,
    group: group.name,
    plainDescription: toPlainText(f.description),
  }));

  const filteredFeaturesByTerm = normalizedSearchTerm
    ? matchSorter(augmentedFeatures, normalizedSearchTerm, {
        keys: ['name', 'group', 'plainDescription', 'tags'],
        threshold: matchSorter.rankings.CONTAINS,
      })
    : augmentedFeatures;

  const filteredFeatures = onlyShowDifferences
    ? filteredFeaturesByTerm.filter((f) => !f.availableOnProfessionalPlan)
    : filteredFeaturesByTerm;

  if (
    (normalizedSearchTerm || onlyShowDifferences) &&
    filteredFeatures.length === 0
  ) {
    return null;
  }

  const isForcedOpen = isOpen || !!normalizedSearchTerm || onlyShowDifferences;

  return (
    <>
      <tr className={s.fTableGroup}>
        <td colSpan={3} onClick={() => setOpen((old) => !old)}>
          {isForcedOpen ? (
            <MinusCircleIcon className={s.fTableGroupIcon} />
          ) : (
            <PlusCircleIcon className={s.fTableGroupIcon} />
          )}
          {group.name}{' '}
          {isForcedOpen ? undefined : (
            <span className={s.fTableGroupCount}>
              ({filteredFeatures.length})
            </span>
          )}
        </td>
      </tr>
      {(isOpen || normalizedSearchTerm || onlyShowDifferences) &&
        filteredFeatures.map((feature, i) => (
          <tr
            key={feature.id}
            className={classNames(
              s.fTableFeature,
              i % 2 === 0 && s.fTableFeatureOdd,
            )}
          >
            <th className={s.fTableFeatureName}>
              <div className={s.fTableFeatureNameSplit}>
                <div className={s.fTableFeatureNameName}>{feature.name} </div>
                {feature.description && (
                  <div className={s.fTableFeatureNameInfo}>
                    <InfoCircleIcon />
                    <div className={s.fTableFeatureNameInfoHint}>
                      <StructuredText data={feature.description} />
                    </div>
                  </div>
                )}
              </div>
            </th>
            <td className={s.fTableFeaturePlan}>
              {feature.availableOnProfessionalPlan ? <Check /> : <Nope />}
            </td>
            <td className={s.fTableFeaturePlan}>
              <Check />
            </td>
          </tr>
        ))}
    </>
  );
}

export default function Pricing({
  page,
  faqs,
  preview,
  review1,
  plans,
  planFeatureGroups,
  hints,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyShowDifferences, setOnlyShowDifferences] = useState(false);
  const [freePlan, proPlan] = plans;
  const [visibleFreePlan, setVisibleFreePlan] = useState(false);

  useEffect(() => {
    if (onlyShowDifferences) {
      setSearchTerm('');
    }
  }, [onlyShowDifferences]);

  useEffect(() => {
    if (searchTerm) {
      setOnlyShowDifferences(false);
    }
  }, [searchTerm]);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <Hero
        kicker="Future-proof your digital experiences"
        title={
          <>
            Flexible pricing,
            <br />
            <Highlight>ready to scale</Highlight>
          </>
        }
        subtitle={
          <>
            Effortless maintenance, seamless operations: unlock substantial
            savings every year by leveraging DatoCMS headless technology and
            content infrastructure
          </>
        }
      />

      <Space top={1}>
        <div className={s.plansStrip}>
          <Wrapper>
            <div className={s.plansContainer}>
              <div className={s.plan}>
                <div className={s.planInner}>
                  <div className={s.planName}>Professional</div>
                  <div className={s.planDescription}>
                    Everything you need — and more – to build professional
                    digital projects
                  </div>

                  <div className={s.planPriceContainer}>
                    <span className={s.planPricePerMonth}>Start at </span>
                    <span className={s.planPrice}>€{formatNumber(149)}</span>
                    <span className={s.planPricePerMonth}>/month</span>

                    <span className={s.planYearlyPrice}>
                      if paying annually, or{' '}
                      <strong>€{formatNumber(199)}/month</strong>
                    </span>
                  </div>

                  <div className={s.planAction}>
                    <Button
                      block
                      s="invert"
                      as="a"
                      href="https://dashboard.datocms.com/personal-account/plan-billing/change?plan_id=294&utm_source=datocms&utm_medium=website&utm_campaign=pricing"
                    >
                      Purchase now
                    </Button>
                  </div>

                  <div className={s.planBullets}>
                    <Bullet>
                      Generous quota included, with soft limits you can exceed
                      and pay-as-you-go
                    </Bullet>
                    <Bullet>
                      10 collaborators included on each project (you can
                      purchase more if needed)
                    </Bullet>
                    <Bullet>
                      Additional projects can be added for as low as €29/month
                    </Bullet>
                    <Bullet>
                      Expanded authoring roles to support most publishing
                      workflows
                    </Bullet>
                    <ReadMore />
                  </div>
                </div>
              </div>

              <div className={s.plan}>
                <div className={s.planInner}>
                  <div className={s.planName}>Enterprise</div>
                  <div className={s.planDescription}>
                    Premium features, high-touch support and advanced compliance
                    for scaled experiences
                  </div>

                  <div className={s.planPriceContainer}>
                    <span className={s.planPrice}>Custom</span>

                    <span className={s.planYearlyPrice}>
                      payable by credit card or wire transfer
                    </span>
                  </div>

                  <div className={s.planAction}>
                    <Button block s="invert" as="a" href="/contact">
                      Contact us
                    </Button>
                  </div>

                  <div className={s.planBullets}>
                    <Bullet>Guaranteed support and uptime SLAs</Bullet>
                    <Bullet>
                      SSO, Audit logs and Static webhook IPs for enhanced
                      security
                    </Bullet>
                    <Bullet>
                      Fully customizable roles and tasks for granular workflows,
                      tailored to your specific needs
                    </Bullet>
                    <Bullet>
                      Support via shared Slack channel, editorial onboarding,
                      plus access to our solution architects
                    </Bullet>
                    <ReadMore />
                  </div>
                </div>
              </div>
            </div>
            <Link href="/partner-program">
              <a className={s.agenciesCta}>
                <AnnouncementIcon />
                <span>
                  <strong>Building lots of sites?</strong> Discover our{' '}
                  <mark>Agency Partner Program</mark> &raquo;
                </span>
              </a>
            </Link>
          </Wrapper>
        </div>
      </Space>

      <Wrapper>
        <div className={s.freePlan}>
          <div className={s.freePlanContent}>
            <div className={s.freePlanTitle}>
              Just getting started? Try DatoCMS out for free, forever (yes
              really)
            </div>
            <div className={s.freePlanDescription}>
              Free plan comes with 2 editors and 300 records, with 10GB of
              traffic and 100k API calls each month. No overages allowed.{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setVisibleFreePlan(true);
                }}
              >
                See all limits in detail <InfoCircleIcon />
              </a>
            </div>
          </div>
          <div className={s.freePlanCta}>
            <Button
              block
              s="invert"
              as="a"
              href="https://dashboard.datocms.com/signup"
            >
              Sign up for free
            </Button>
            <div className={s.freePlanCtaReassurance}>
              Easy setup, no credit card required
            </div>
          </div>
        </div>
      </Wrapper>

      {visibleFreePlan && (
        <div
          className={s.modalOverlay}
          onClick={() => setVisibleFreePlan(false)}
        >
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <a
              href="#"
              className={s.modalClose}
              onClick={(e) => {
                e.preventDefault();
                setVisibleFreePlan(false);
              }}
            >
              <CloseIcon />
            </a>
            <div className={s.modalTitle}>Free vs Professional</div>
            <div className={s.modalWarning}>
              ⚠️{' '}
              <strong>
                In the Free plan, you can&apos;t go over the allowed monthly
                limits.
              </strong>{' '}
              If you reach these limits, the service will stop responding as
              expected.
            </div>
            <div className={s.fTableScroll}>
              <FreeLimitsTable
                hints={hints}
                freePlan={freePlan}
                proPlan={proPlan}
              />
            </div>
          </div>
        </div>
      )}

      <a id="details" />
      <Space top={2}>
        <Wrapper>
          <InterstitialTitle style="three">
            Compare plans
            <div className={s.searchFeatures}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search features"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')}>
                  <CloseIcon />
                </button>
              )}
            </div>
          </InterstitialTitle>
          <div className={s.fTableScroll}>
            <a className={s.fTableAnchor} id="detailsTable" />
            <table className={s.fTable}>
              <thead>
                <th className={s.fTableHead}>
                  <div className={s.fTableHeadTitle}>Features by plan</div>
                  <div className={s.fTableHeadSub}>
                    Explore our features and choose the best plan for you
                  </div>
                  <label className={s.fTableHeadDiff}>
                    <RcSwitch
                      id="showDiff"
                      checked={onlyShowDifferences}
                      onChange={(value) => {
                        setOnlyShowDifferences(value);
                        document
                          .getElementById('detailsTable')
                          .scrollIntoView({ behavior: 'smooth' });
                      }}
                    />{' '}
                    <span>Only show differences</span>
                  </label>
                </th>
                <th className={s.fTablePlan}>
                  <div className={s.fTablePlanName}>Professional</div>
                  <div className={s.fTablePlanPrice}>
                    From €{formatNumber(149)}/month (billed annually)
                  </div>
                  <Button
                    block
                    s="invert"
                    as="a"
                    p="tiny"
                    href="https://dashboard.datocms.com/personal-account/plan-billing/change?plan_id=294&utm_source=datocms&utm_medium=website&utm_campaign=pricing"
                  >
                    Purchase now
                  </Button>
                </th>
                <th className={s.fTablePlan}>
                  <div className={s.fTablePlanName}>Enterprise</div>
                  <div className={s.fTablePlanPrice}>
                    Tailored on your needs
                  </div>
                  <Button block p="tiny" s="invert" as="a" href="/contact">
                    Contact us
                  </Button>
                </th>
              </thead>
              {planFeatureGroups.map((group, i) => (
                <FeatureGroup
                  startOpen={i === 0}
                  key={group.id}
                  group={group}
                  searchTerm={searchTerm}
                  onlyShowDifferences={onlyShowDifferences}
                />
              ))}
              <LimitsGroup
                forceOpen={onlyShowDifferences}
                proPlan={proPlan}
                hints={hints}
              />
            </table>
          </div>
        </Wrapper>
      </Space>

      <Space top={3}>
        <Wrapper>
          <InterstitialTitle>Frequently asked questions</InterstitialTitle>
          <div className={s.faqs}>
            {faqs.map((faq) => (
              <div key={faq.id} className={s.faq}>
                <div className={s.faqQ}>{faq.question}</div>
                <div className={s.faqA}>
                  <StructuredText data={faq.answer} />
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </Space>

      <Space top={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[
            <DeutscheTelekom key="DeutscheTelekom" />,
            <Hashicorp key="Hashicorp" />,
            <Verizon key="Verizon" />,
            <Polestar key="Polestar" />,
            <Vercel key="Vercel" />,
          ]}
        />
      </Space>

      <Quote review={review1} />
    </Layout>
  );
}
