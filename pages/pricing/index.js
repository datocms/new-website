import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import s from './style.module.css';
import { request } from 'lib/datocms';
import gql from 'graphql-tag';
import tiny from 'tiny-json-http';
import cn from 'classnames';
import formatNumber from 'utils/formatNumber';
import prettyBytes from 'utils/prettyBytes';
import Check from 'public/icons/regular/check.svg';
import Down from 'public/icons/regular/chevron-down.svg';
import InterstitialTitle from 'components/InterstitialTitle';
import Space from 'components/Space';
import { useState, useCallback } from 'react';

const Plan = ({
  name,
  description,
  price,
  priceKicker,
  priceSubtitle,
  bullets,
}) => (
  <>
    <div className={s.plan}>
      <div className={s.planHeader}>
        <div className={s.planName}>{name}</div>
        <div className={s.planDescription}>{description}</div>
        <div className={s.planPriceContainer}>
          <div className={s.planPriceKicker}>{priceKicker}</div>
          <div className={s.planPrice}>{price}</div>
          <div className={s.planPriceSubtitle}>{priceSubtitle}</div>
        </div>
      </div>
      <div className={s.planIncluded}>What's included?</div>
      <div className={s.planBullets}>{bullets}</div>
    </div>
  </>
);

const limitLabel = limit => {
  if (limit === 'item_types') {
    return 'models';
  }

  if (limit === 'deployment_environments') {
    return 'environments';
  }

  if (limit === 'traffic_bytes') {
    return 'traffic';
  }

  if (limit === 'api_calls') {
    return 'calls';
  }

  if (limit === 'mux_encoding_seconds') {
    return 'of video input';
  }

  if (limit === 'mux_streaming_seconds') {
    return 'of delivered video';
  }
  return limit;
};

const formatValue = (name, value) => {
  if (name.endsWith('months')) {
    return `${value} ${value === 1 ? ' month' : ' months'}`;
  }

  if (name.endsWith('seconds')) {
    return value > 60 * 60
      ? `${parseInt(value / 60 / 60)} hours`
      : `${parseInt(value / 60)} minutes`;
  }

  if (name.endsWith('bytes')) {
    return prettyBytes(value);
  }

  if (Number.isInteger(value)) {
    return formatNumber(value);
  }

  return value;
};

const ValueForLimit = ({ limit, plan, hint }) => {
  if (plan.attributes && limit in plan.attributes) {
    const value = plan.attributes[limit];

    if (value === null) {
      return <span>Unlimited</span>;
    }

    if (value === 0) {
      return <span />;
    }

    if (value === true) {
      return <Check />;
    }

    return <span>{formatValue(limit, value)}</span>;
  }

  const value = hint.plans[plan.id];

  if (value === ':check:') {
    return <Check />;
  }

  if (value === undefined) {
    return <span>Custom</span>;
  }

  return <span>{value}</span>;
};

const ToggleQuota = ({ name, children }) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(e => {
    e.preventDefault();
    setOpen(s => !s);
  });
  return (
    <>
      <a href="#" onClick={toggle} className={s.quotaName}>
        {name} <Down />
      </a>
      {open && <div className={s.quotaDescription}>{children}</div>}
    </>
  );
};

export const getStaticProps = async () => {
  const { body: datoPlans } = await tiny.get({
    url: `https://account-api.datocms.com/plans`,
    headers: { accept: 'application/json' },
  });

  const {
    data: { plans, hints },
  } = await request({
    query: gql`
      {
        plans: allPlans {
          apiId
          name
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
      }
    `,
  });

  return {
    props: {
      plans: plans.map(
        ({ apiId, name }) =>
          datoPlans.data.find(dp => {
            return dp.id === apiId;
          }) || { id: 'enterprise', attributes: { name } },
      ),
      hints: hints
        .filter(
          hint =>
            ![
              'roles',
              'plugins',
              'access_tokens',
              'deployment_environments',
            ].includes(hint.apiId),
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

export default function Pricing({ hints, plans }) {
  return (
    <Layout>
      <Head>
        <title>Pricing</title>
      </Head>
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
            Save tens of thousands of dollars annually by using DatoCMS headless
            technologies and content infrastructure
          </>
        }
      />
      <div className={s.plans}>
        <Wrapper>
          <div className={s.plansInner}>
            <Plan
              name="Developer"
              description="Perfect for small projects with low&nbsp;traffic"
              price="Free"
              priceSubtitle="No credit card needed"
              bullets={
                <ul>
                  <li>All of our standard features</li>
                  <li>Invite a single collaborator</li>
                  <li>Hard limits on quota</li>
                  <li>Community-based support</li>
                </ul>
              }
            />
            <Plan
              name="Professional"
              description="For larger teams &amp; high volume&nbsp;projects"
              priceKicker="From"
              price="€99"
              priceSubtitle="per project/month"
              bullets={
                <ul>
                  <li>All of our standard features</li>
                  <li>As many collaborators as you want</li>
                  <li>Soft limits on quota</li>
                  <li>Email support (24h response time)</li>
                </ul>
              }
            />
            <Plan
              name="Enterprise"
              description="For companies looking to build a lasting brand and drive growth "
              priceKicker="From"
              price="€1,500"
              priceSubtitle="per month"
              bullets={
                <ul>
                  <li>Private cloud, custom endpoints</li>
                  <li>Service level agreements</li>
                  <li>Custom quota, predictable costs</li>
                  <li>Onboarding, Slack/phone support</li>
                </ul>
              }
            />
          </div>
        </Wrapper>
      </div>
      <Space top={4}>
        <InterstitialTitle style="two">Compare plans</InterstitialTitle>
        <Wrapper>
          <table className={s.compare}>
            <tbody>
              <tr>
                <td />
                {plans.map(plan => (
                  <td key={plan.id} className={s.comparePlan}>
                    {plan.attributes.name}
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
                  {plans.map(plan => {
                    const extraPacket =
                      plan.attributes &&
                      ((plan.attributes.extra_packets &&
                        plan.attributes.extra_packets[limit]) ||
                        (plan.attributes.auto_packets &&
                          plan.attributes.auto_packets[limit]));

                    return (
                      <td key={`hint-plan-${plan.id}`} className={s.quotaValue}>
                        <div>
                          <ValueForLimit
                            limit={limit}
                            hint={hint}
                            plan={plan}
                          />
                        </div>
                        {extraPacket && (
                          <div className={s.quotaExtra}>
                            {extraPacket.amount_per_packet === 1
                              ? `Extra ${limitLabel(limit)} for €${
                                  extraPacket.price
                                } each`
                              : `€${extraPacket.price} every ${formatValue(
                                  limit,
                                  extraPacket.amount_per_packet,
                                )} extra ${limitLabel(limit).replace(
                                  /_/g,
                                  ' ',
                                )}`}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Wrapper>
      </Space>
    </Layout>
  );
}

// - GraphQL API to fetch content
// - Unlimited plugins
// - Unlimited image transformations
// - AI-based smart image tagging
// - Granular roles and permissions
