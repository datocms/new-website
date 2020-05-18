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
import prettyBytes from 'utils/prettyBytes';
import Check from 'public/icons/regular/check.svg';
import Cross from 'public/icons/regular/times.svg';
import Down from 'public/icons/regular/chevron-down.svg';
import InterstitialTitle from 'components/InterstitialTitle';
import Space from 'components/Space';
import { useState, useCallback } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import LogosBar from 'components/LogosBar';
import { Badge } from 'components/PluginToolkit';

const Plan = ({
  name,
  description,
  price,
  priceSubtitle,
  bullets,
  color,
  planId,
}) => (
  <>
    <div className={s.plan}>
      <div className={s.planHeader}>
        <div className={s.planName} style={{ color }}>
          {name}
        </div>
        <div className={s.planDescription}>{description}</div>
        <div className={s.planPriceContainer}>
          <div className={s.planPriceKicker}>{price > 0 && 'From'}</div>
          <div className={s.planPrice}>€{formatNumber(price)}</div>
          <div className={s.planPriceSubtitle}>{priceSubtitle}</div>
        </div>
      </div>
      <div className={s.planIncluded}>What's included?</div>
      <div className={s.planBullets}>{bullets}</div>
      <div className={s.planAction}>
        {planId === 'enterprise' ? (
          <Link href="/contact">
            <Button block p="big" s="invert" as="a">
              Contact us
            </Button>
          </Link>
        ) : (
          <Button
            block
            p="big"
            s={price > 0 && 'invert'}
            as="a"
            href="https://dashboard.datocms.com/projects/browse/new"
          >
            {price === 0 ? 'Get started for free' : 'Buy plan'}
          </Button>
        )}
      </div>
    </div>
  </>
);

const limitLabel = (limit) => {
  if (limit === 'item_types') {
    return 'models';
  }

  if (limit === 'build_triggers') {
    return 'build triggers';
  }

  if (limit === 'traffic_bytes') {
    return 'traffic';
  }

  if (limit === 'api_calls') {
    return 'calls';
  }

  if (limit === 'mux_encoding_seconds') {
    return 'footage';
  }

  if (limit === 'mux_streaming_seconds') {
    return 'video delivered to visitors';
  }

  if (limit === 'items') {
    return 'records';
  }

  if (limit === 'uploadable_bytes') {
    return 'storage';
  }

  return limit;
};

const formatValue = (name, value) => {
  if (name.endsWith('days')) {
    return `${value} days`;
  }

  if (name.endsWith('seconds')) {
    return value / 60 >= 5000 ? (
      <>{formatNumber(parseInt(value / 60 / 60))}&nbsp;hrs</>
    ) : (
      <>{formatNumber(parseInt(value / 60))}&nbsp;mins</>
    );
  }

  if (name.endsWith('bytes')) {
    return prettyBytes(value);
  }

  if (Number.isInteger(value)) {
    return formatNumber(value);
  }

  return value;
};

const hasUnit = (name) => {
  return (
    name.endsWith('days') || name.endsWith('seconds') || name.endsWith('bytes')
  );
};

const ValueForLimit = ({ limit, plan, hint, suffix }) => {
  if (plan.attributes && limit in plan.attributes) {
    const value = plan.attributes[limit];

    if (value === null) {
      return <span>Unlimited</span>;
    }

    if (value === 0) {
      return <span />;
    }

    if (value === true) {
      return <Check className={s.check} />;
    }

    if (value === false) {
      return <Cross className={s.cross} />;
    }

    return (
      <span>
        {formatValue(limit, value)}
        {suffix}
      </span>
    );
  }

  const value = hint.plans[plan.id];

  if (value === ':check:') {
    return <Check className={s.check} />;
  }

  if (value === undefined) {
    return <span>Custom</span>;
  }

  return (
    <span>
      {value ? (
        <>
          {value}
          {suffix}
        </>
      ) : (
        <Cross className={s.cross} />
      )}
    </span>
  );
};

const ToggleQuota = ({ name, children }) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback((e) => {
    e.preventDefault();
    setOpen((s) => !s);
  });
  return (
    <>
      <a href="#" onClick={toggle} className={s.quotaName}>
        <span>{name}</span>
        <Down />
      </a>
      {open && <div className={s.quotaDescription}>{children}</div>}
    </>
  );
};

const Switch = ({ label, onChange, value }) => (
  <div className={s.switchContainer} onClick={() => onChange(!value)}>
    <div className={cn(s.switch, { [s.switchOn]: value })} /> {label}
  </div>
);

export const getStaticProps = async ({ preview }) => {
  const { body: datoPlans } = await tiny.get({
    url: `https://account-api.datocms.com/plans`,
    headers: { accept: 'application/json' },
  });

  const {
    data: { plans, hints, ...others },
  } = await request({
    query: gql`
      {
        page: pricingPage {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
        }
        plans: allPlans {
          apiId
          name
          color {
            hex
          }
          description
          bullets(markdown: true)
          monthlyPrice
          priceUnit
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
          plans {
            plan {
              apiId
            }
            value
          }
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
  });

  return {
    props: {
      ...others,
      preview: preview || false,
      plans: plans.map((datoPlan) => ({
        ...(datoPlans.data.find((dp) => {
          return dp.id === datoPlan.apiId;
        }) || { id: 'enterprise' }),
        cmsAttributes: datoPlan,
      })),
      hints: hints
        .filter(
          (hint) => !['roles', 'plugins', 'access_tokens'].includes(hint.apiId),
        )
        .reduce((acc, hint) => {
          acc[hint.apiId] = {
            name: hint.name,
            description: hint.description,
            plans: hint.plans.reduce((acc, plan) => {
              acc[plan.plan.apiId || 'enterprise'] = plan.value;
              return acc;
            }, {}),
          };
          return acc;
        }, {}),
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

      <Switch
        label={
          <>
            Annual pricing&nbsp;&nbsp;<Badge>50% OFF!</Badge>
          </>
        }
        value={annualPricing}
        onChange={setAnnualPricing}
      />

      <div className={s.plans}>
        <div className={s.plansInner}>
          {plans.map((plan) => (
            <div key={plan.id} className={s.planContainer}>
              <Plan
                planId={plan.id}
                name={plan.cmsAttributes.name}
                color={plan.cmsAttributes.color.hex}
                description={plan.cmsAttributes.description}
                price={
                  plan.cmsAttributes.monthlyPrice ||
                  (annualPricing
                    ? plan.attributes.yearly_price / 12
                    : plan.attributes.monthly_price)
                }
                priceSubtitle={plan.cmsAttributes.priceUnit}
                bullets={
                  <SmartMarkdown>{plan.cmsAttributes.bullets}</SmartMarkdown>
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Wrapper>
        <div className={s.volume}>
          <div className={s.volumeLeft}>
            <strong>You're an agency?</strong> Contact us if you need to build
            multiple projects at once: we can offer{' '}
            <strong>up to 80% volume discount!</strong>
          </div>
          <div className={s.volumeRight}>
            <Link href="/contact">
              <Button as="a" p="small" invert>
                Get a quote
              </Button>
            </Link>
          </div>
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
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </Space>

      <Space top={4}>
        <InterstitialTitle style="two">Compare plans</InterstitialTitle>
        <Wrapper>
          <div className={s.compare}>
            <table className={s.compareTable}>
              <tbody>
                <tr>
                  <td />
                  {plans.map((plan) => (
                    <td key={plan.id} className={s.comparePlan}>
                      {plan.cmsAttributes.name}
                    </td>
                  ))}
                </tr>
                {Object.entries(hints).map(([limit, hint]) => (
                  <tr key={limit}>
                    <td className={s.quota}>
                      <ToggleQuota name={hint.name}>
                        {hint.description}
                      </ToggleQuota>
                    </td>
                    {plans.map((plan) => {
                      const extraPacket =
                        plan.attributes &&
                        ((plan.attributes.extra_packets &&
                          plan.attributes.extra_packets[limit]) ||
                          (plan.attributes.auto_packets &&
                            plan.attributes.auto_packets[limit]));

                      return (
                        <td
                          key={`hint-plan-${plan.id}`}
                          className={s.quotaValue}
                        >
                          <div>
                            <ValueForLimit
                              limit={limit}
                              hint={hint}
                              plan={plan}
                              suffix={
                                [
                                  'mux_streaming_seconds',
                                  'mux_encoding_seconds',
                                  'api_calls',
                                  'traffic_bytes',
                                ].includes(limit) && '/month'
                              }
                            />
                          </div>
                          {extraPacket && (
                            <div className={s.quotaExtra}>
                              {extraPacket.amount_per_packet === 1 ? (
                                <>
                                  Extra {limitLabel(limit)} for €
                                  {extraPacket.price} each
                                </>
                              ) : (
                                <>
                                  €{extraPacket.price} every{' '}
                                  {formatValue(
                                    limit,
                                    extraPacket.amount_per_packet,
                                  )}
                                  {hasUnit(limit) ? ' of ' : ' '}
                                  additional{' '}
                                  {limitLabel(limit).replace(/_/g, ' ')}
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
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
