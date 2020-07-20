import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import SmartMarkdown from 'components/SmartMarkdown';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Quote from 'components/Quote';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import s from './style.module.css';
import {
  imageFields,
  reviewFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import gql from 'graphql-tag';
import tiny from 'tiny-json-http';
import formatNumber from 'utils/formatNumber';
import InterstitialTitle from 'components/InterstitialTitle';
import Space from 'components/Space';
import { useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import { Badge } from 'components/PluginToolkit';
import {
  hasUnit,
  limitLabel,
  formatValue,
  perMonth,
} from 'utils/planLimitsHelpers';

const Switch = ({ label, onChange, value }) => (
  <div className={s.switchContainer} onClick={() => onChange(!value)}>
    <div className={cn(s.switch, { [s.switchOn]: value })} /> {label}
  </div>
);

export const getStaticProps = async ({ preview }) => {
  const {
    body: { data: datoPlans },
  } = await tiny.get({
    url: `https://account-api.datocms.com/account-plans`,
    headers: { accept: 'application/json' },
  });

  const {
    data: { hints, ...others },
  } = await request({
    query: gql`
      {
        page: pricingPage {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
        }
        faqs: allFaqs {
          id
          question
          answer(markdown: true)
        }
        hints: allPricingHints {
          apiId
          name
          description
        }
        review1: review(filter: { id: { eq: "3686622" } }) {
          ...reviewFields
        }
        review2: review(filter: { id: { eq: "4368343" } }) {
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
  const [annualPricing, setAnnualPricing] = useState(true);

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

      <Wrapper>
        <div className={s.switchWrapper}>
          <Switch
            label={
              <>
                Annual pricing&nbsp;&nbsp;<Badge>50% OFF!</Badge>
              </>
            }
            value={annualPricing}
            onChange={setAnnualPricing}
          />
        </div>
      </Wrapper>
      <div className={s.plansStrip}>
        <Wrapper>
          <div className={s.plansContainer}>
            <div />
            {plans.map((plan) => {
              const price = annualPricing
                ? plan.attributes.yearly_price / 12
                : plan.attributes.monthly_price;
              return (
                <div className={s.plan}>
                  <div
                    className={s.planName}
                    style={{ color: plan.attributes.color_hex }}
                  >
                    {plan.attributes.name}
                  </div>
                  <div className={s.planDescription}>
                    {plan.attributes.description}
                  </div>

                  <div className={s.planPriceContainer}>
                    <span className={s.planPriceKicker}>
                      {price > 0 && 'from'}{' '}
                    </span>
                    <span className={s.planPrice}>€{formatNumber(price)}</span>
                    <span className={s.planPricePerMonth}>/mo</span>
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
            })}
            <div className={s.plan}>
              <div className={s.planName}>Enterprise</div>
              <div className={s.planDescription}>
                For ultimate control, security and flexibility
              </div>
              <div className={s.planPriceContainer}>
                <span className={s.planPrice}>Custom</span>
              </div>
              <div className={s.planAction}>
                <Link href="/contact">
                  <Button block s="invert" as="a">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
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

                let content;

                if (limit.type === 'countable_system_limit') {
                  content = formatValue(limit.id, limit.limit);
                } else if (
                  limit.type === 'per_site_quota_managed_site_resource'
                ) {
                  content = limit.extra_packet_amount ? (
                    <>
                      {perMonth(
                        limit.id,
                        formatValue(
                          limit.id,
                          limit.free_of_charge_per_site_usage,
                        ),
                      )}{' '}
                      per project
                    </>
                  ) : (
                    <>
                      Up to{' '}
                      {perMonth(
                        limit.id,
                        formatValue(
                          limit.id,
                          limit.free_of_charge_per_site_usage,
                        ),
                      )}{' '}
                      per project
                    </>
                  );
                } else if (
                  limit.type === 'per_environment_quota_managed_site_resource'
                ) {
                  content = limit.extra_packet_amount ? (
                    <>
                      {perMonth(
                        limit.id,
                        formatValue(
                          limit.id,
                          limit.free_of_charge_per_environment_usage,
                        ),
                      )}{' '}
                      included per project
                    </>
                  ) : (
                    <>
                      Up to{' '}
                      {perMonth(
                        limit.id,
                        formatValue(
                          limit.id,
                          limit.free_of_charge_per_environment_usage,
                        ),
                      )}{' '}
                      per project
                    </>
                  );
                } else {
                  content = limit.extra_packet_amount ? (
                    <>
                      {perMonth(
                        limit.id,
                        formatValue(limit.id, limit.free_of_charge_usage),
                      )}{' '}
                      included
                    </>
                  ) : (
                    <>
                      Up to{' '}
                      {perMonth(
                        limit.id,
                        formatValue(limit.id, limit.free_of_charge_usage),
                      )}
                    </>
                  );
                }

                return (
                  <div
                    key={plan.id}
                    className={cn(s.limitPlan, {
                      [s.limitPlanWithExtra]: !!limit.extra_packet_amount,
                    })}
                  >
                    {content}
                  </div>
                );
              })}
              <div className={s.limitPlan}>Custom</div>
              {limitsWithExtrasToRender.map((limit) => {
                return (
                  <div
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
                    {limit.extra_packet_amount === 1 ? (
                      <span>
                        then €{limit.extra_packet_price} per extra{' '}
                        {limitLabel(limit.id)}
                      </span>
                    ) : (
                      <span>
                        then €{limit.extra_packet_price} every{' '}
                        {formatValue(limit.id, limit.extra_packet_amount)}
                        {hasUnit(limit.id) ? ' of ' : ' '}
                        extra {limitLabel(limit.id).replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
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
                <div className={s.stdBulletTitle}>Unlimited plugins</div>
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

      <Quote review={review1} />

      <Space bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
        />
      </Space>

      <Space top={3}>
        <Wrapper>
          <InterstitialTitle>Frequently asked questions</InterstitialTitle>
          <div className={s.faqs}>
            {faqs.map((faq) => (
              <div key={faq.id} className={s.faq}>
                <div className={s.faqQ}>{faq.question}</div>
                <div className={s.faqA}>
                  <SmartMarkdown>{faq.answer}</SmartMarkdown>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </Space>
    </Layout>
  );
}
