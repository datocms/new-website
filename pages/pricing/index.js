import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Quote from 'components/Quote';
import Head from 'components/Head';
import { renderMetaTags, StructuredText } from 'react-datocms';
import s from './style.module.css';
import {
  imageFields,
  reviewFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import tiny from 'tiny-json-http';
import formatNumber from 'utils/formatNumber';
import InterstitialTitle from 'components/InterstitialTitle';
import Space from 'components/Space';
import cn from 'classnames';
import Link from 'next/link';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import { formatLimit, formatExtra } from 'utils/planLimitsHelpers';
import TitleStripWithContent from 'components/TitleStripWithContent';
import SuccessIcon from 'public/icons/regular/check.svg';
import Bullets from 'components/Bullets';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import AnnouncementIcon from 'public/images/illustrations/marketers.svg';
import { Badge } from 'components/PluginToolkit';
import Tier1 from 'public/images/tiers/tier-1.svg';
import Tier2 from 'public/images/tiers/tier-2.svg';
import Tier3 from 'public/images/tiers/tier-3.svg';
import { handleErrors } from 'lib/datocms';

const TierIcons = [Tier1, Tier2, Tier3];

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    body: { data: datoPlans },
  } = await tiny.get({
    url: `https://account-api.datocms.com/account-plans`,
    headers: { accept: 'application/json' },
  });

  const {
    data: { hints, ...others },
  } = await request({
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
        hints: allPricingHints {
          apiId
          name
          description
        }
        review1: review(filter: { name: { eq: "Tore Heimann" } }) {
          ...reviewFields
        }
        review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
          ...reviewFields
        }
      }
      ${imageFields}
      ${reviewFields}
      ${seoMetaTagsFields}
    `,
    preview,
  });

  const plan = datoPlans[0];

  return {
    props: {
      ...others,
      preview: preview || false,
      plans: datoPlans.sort(
        (a, b) => a.attributes.monthly_price - b.attributes.monthly_price,
      ),
      hints: hints.filter((hint) => {
        const limit = plan.attributes.limits.find((l) => l.id === hint.apiId);

        if (
          !limit ||
          !(
            limit.type === 'shared_quota_metered_site_resource' ||
            limit.id === 'support_level' ||
            limit.extra_packets_available_in_some_plan
          )
        ) {
          return null;
        }

        return true;
      }),
    },
  };
});

const PlanBox = ({ plan, hints, icon: Icon }) => {
  const monthlyPrice = plan.attributes.monthly_price;
  const yearlyPrice = plan.attributes.yearly_price / 12;

  return (
    <div key={plan.id} className={s.plan}>
      <Icon className={s.planImage} />
      <div className={s.planName} style={{ color: plan.attributes.color_hex }}>
        {plan.attributes.name}
      </div>
      <div className={s.planDescription}>{plan.attributes.description}</div>

      <div className={s.planPriceContainer}>
        <span className={s.planPrice}>€{formatNumber(yearlyPrice)}</span>
        <span className={s.planPricePerMonth}>/month</span>

        {monthlyPrice > 0 ? (
          <span className={s.planYearlyPrice}>
            if paying annually, or{' '}
            <strong>€{formatNumber(monthlyPrice)}/month</strong>
          </span>
        ) : (
          <span className={s.planYearlyPrice}>No credit card required</span>
        )}
      </div>

      <div className={s.planLimits}>
        {hints.map((hint) => {
          const limit = plan.attributes.limits.find((l) => l.id === hint.apiId);
          return (
            <div key={hint.apiId} className={s.planLimit}>
              <div className={s.planLimitName}>{hint.name}</div>

              <div className={cn(s.planLimitIncluded)}>
                {formatLimit(limit)}
              </div>
              {limit.extra_packet_amount && (
                <div className={s.planLimitExtra}>
                  then {formatExtra(limit)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={s.planAction}>
        <Button
          block
          s="invert"
          as="a"
          href="https://dashboard.datocms.com/projects/browse/new"
        >
          Try for free
        </Button>
      </div>
    </div>
  );
};

export default function Pricing({
  page,
  hints,
  plans,
  faqs,
  preview,
  review1,
  review2,
}) {
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
            Zero maintenance, zero operations: save tens of thousands of dollars
            annually by using DatoCMS headless technology and
            content&nbsp;infrastructure
          </>
        }
      />

      <Space top={1}>
        <div className={s.plansStrip}>
          <Wrapper>
            <div className={s.plansContainer}>
              <div />
              <Link href="/pricing/agencies">
                <a className={s.agenciesCta}>
                  <AnnouncementIcon />
                  <span>
                    <mark>Building lots of sites?</mark> Find out about our
                    Agency Parter program! &raquo;
                  </span>
                </a>
              </Link>
              <div />
              {plans.map((plan, index) => (
                <PlanBox
                  key={plan.id}
                  plan={plan}
                  hints={hints}
                  icon={TierIcons[index]}
                />
              ))}
            </div>
          </Wrapper>
        </div>
      </Space>
      <Wrapper>
        {hints.map((hint) => {
          const limitsWithExtras = plans
            .map((plan) =>
              plan.attributes.limits.find((l) => l.id === hint.apiId),
            )
            .filter((x) => x.extra_packet_price);

          const extraPacketPrices = limitsWithExtras.map(
            (l) => l.extra_packet_price,
          );

          const allSameExtras = extraPacketPrices.every(
            (price) => price === extraPacketPrices[0],
          );

          const limitsWithExtrasToRender = allSameExtras
            ? limitsWithExtras.slice(0, 1)
            : limitsWithExtras;

          return (
            <div key={hint.apiId} className={s.limit}>
              <div className={s.limitLegend}>{hint.name}</div>
              {plans.map((plan) => {
                const limit = plan.attributes.limits.find(
                  (l) => l.id === hint.apiId,
                );

                const isScaleProjectsLimit =
                  limit.id === 'sites' &&
                  limit.free_of_charge_usage > 1 &&
                  plan.attributes.monthly_price > 0;

                return (
                  <div
                    key={plan.id}
                    className={cn(s.limitPlan, {
                      [s.limitPlanWithExtra]: !!limit.extra_packet_amount,
                    })}
                  >
                    {isScaleProjectsLimit && <div className={s.circle} />}
                    {formatLimit(limit)}
                    {isScaleProjectsLimit && (
                      <>
                        {' '}
                        <Badge>NEW!</Badge>
                      </>
                    )}
                  </div>
                );
              })}
              {limitsWithExtrasToRender.map((limit) => {
                return (
                  <div
                    key={`${limit.id}-${limit.extra_packet_price}`}
                    className={cn(s.limitExtra, {
                      [s.limitExtraWide]: allSameExtras,
                    })}
                    style={
                      allSameExtras
                        ? {
                            gridColumn: `3 / span ${limitsWithExtras.length}`,
                          }
                        : {}
                    }
                  >
                    <span>then {formatExtra(limit)}</span>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className={s.fullComparison}>
          <Link href="/pricing/compare" passHref>
            <Button p="small" s="invert">
              See a full plan comparison <ArrowIcon />
            </Button>
          </Link>
        </div>
      </Wrapper>

      <Space top={2}>
        <Wrapper>
          <div className={s.std}>
            <div className={s.stdTitle}>And included in every plan...</div>
            <div className={s.stdBullets}>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>GraphQL API</div>
                <div className={s.stdBulletDesc}>
                  An understandable description of your API, the power to ask
                  exactly the data you need and powerful developer tools
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>Worldwide CDN</div>
                <div className={s.stdBulletDesc}>
                  Delight your customers with lightning fast responses thanks to
                  our CDN: performant, secure, and close to every customer
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  Granular roles and permissions
                </div>
                <div className={s.stdBulletDesc}>
                  Assign the appropriate roles and permissions to your members,
                  precisely determining what actions they can perform
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>Plugins</div>
                <div className={s.stdBulletDesc}>
                  Easily expand the capabilities of DatoCMS with plugins to
                  handle custom editing needs and 3rd-party integrations
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  Unlimited image transformations
                </div>
                <div className={s.stdBulletDesc}>
                  Optimize, resize, crop, rotate and watermark images on-the-fly
                  simply adding custom parameters to the URL of your images
                </div>
              </div>
              <div className={s.stdBullet}>
                <div className={s.stdBulletTitle}>
                  AI-based smart image tagging
                </div>
                <div className={s.stdBulletDesc}>
                  Locate media files quickly using AI-powered tagging and
                  advanced search capabilities, saved filters and asset folders
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </Space>

      <Space top={2}>
        <TitleStripWithContent
          title={<>Enterprises</>}
          subtitle={
            <>
              <p>
                Get dedicated onboarding service, premium technical support,
                private cloud and custom SLAs to gain the assurance your
                enterprise needs. Grows with your needs, from one team or
                business unit to your whole organization.
              </p>
              <div className={s.buttonGroup}>
                <Link href="/enterprise-headless-cms" passHref>
                  <Button p="small" s="invert">
                    Learn more
                  </Button>
                </Link>
                <Link href="/enterprise-headless-cms#form" passHref>
                  <Button p="small">Contact sales</Button>
                </Link>
              </div>
            </>
          }
        >
          <div className={s.enterprise}>
            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Services</div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Guaranteed support SLAs',
                  'High priority support',
                  'Shared Slack channel',
                  'Customer success',
                  'Onboarding services',
                  'Solution Architects',
                ]}
              />
            </div>

            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Governance</div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Single Sign-On',
                  'SCIM v2 user provisioning',
                  'Security reporting',
                  'Platform white-labelling',
                  'User Management API',
                  'Static webhook IPs',
                ]}
              />
            </div>

            <div className={s.enterpriseGroup}>
              <div className={s.enterpriseGroupTitle}>Infrastructure </div>
              <Bullets
                style="good"
                icon={SuccessIcon}
                bullets={[
                  'Guaranteed uptime SLAs',
                  'Single-tenant infrastructure',
                  'Multi-region infrastructure',
                  'Audit logs API',
                  'Daily backups',
                  '24/7 monitoring',
                ]}
              />
            </div>
          </div>
        </TitleStripWithContent>
      </Space>

      <Quote review={review1} />

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
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
        />
      </Space>
    </Layout>
  );
}
