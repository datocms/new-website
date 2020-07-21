import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import s from './style.module.css';
import { request } from 'lib/datocms';
import gql from 'graphql-tag';
import tiny from 'tiny-json-http';
import {
  formatLimitRaw,
  formatExtra,
  limitType,
} from 'utils/planLimitsHelpers';

const groupBy = (items, fn) =>
  items.reduce((result, item) => {
    const key = fn(item);

    return {
      ...result,
      [key]: [...(result[key] || []), item],
    };
  }, {});

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
        hints: allPricingHints {
          apiId
          name
          description
        }
      }
    `,
    preview,
  });

  return {
    props: {
      ...others,
      preview: preview || false,
      plans: datoPlans.sort(
        (a, b) => a.attributes.monthly_price - b.attributes.monthly_price,
      ),
      hints,
    },
  };
};

export default function ComparePricing({ hints, plans, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Full plan comparison</title>
      </Head>
      <Hero title={<>Full plan comparison</>} />
      <Wrapper>
        <table className={s.table}>
          <tbody>
            {Object.entries(
              groupBy(
                plans[0].attributes.limits.sort((a, b) =>
                  a.type.localeCompare(b.type),
                ),
                (limit) =>
                  limit.type.includes('shared')
                    ? 'shared_quota_managed_site_resource'
                    : ['activable_feature', 'boolean_system_limit'].includes(
                        limit.type,
                      )
                    ? 'boolean_system_limit'
                    : limit.type,
              ),
            ).map(([group, limits]) => (
              <React.Fragment key={group}>
                <tr>
                  <th className={s.group} width="20%">
                    {limitType(group)}
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className={s.group} width="20%">
                      {plan.attributes.name}
                    </th>
                  ))}
                  <th className={s.group} width="20%">
                    Enterprise
                  </th>
                </tr>
                {limits.map((limit) => {
                  const hint = hints.find((h) => h.apiId === limit.id);

                  return (
                    <React.Fragment key={limit.id}>
                      <tr>
                        <th>{hint ? hint.name : limit.id}</th>
                        {plans.map((plan) => {
                          const planLimit = plan.attributes.limits.find(
                            (l) => l.id === limit.id,
                          );
                          return (
                            <td key={plan.id}>
                              {formatLimitRaw(planLimit)}
                              {[
                                'account_managed_resource',
                                'per_site_quota_managed_site_resource',
                                'per_environment_quota_managed_site_resource',
                                'shared_quota_managed_site_resource',
                                'shared_quota_metered_site_resource',
                              ].includes(limit.type) &&
                                planLimit.extra_packet_amount && (
                                  <div className={s.extra}>
                                    {formatExtra(planLimit)}
                                  </div>
                                )}
                            </td>
                          );
                        })}
                        <td>
                          {limit.type.includes('resource') && 'Custom'}
                          {limit.type === 'countable_system_limit' && 'Custom'}
                          {[
                            'activable_feature',
                            'boolean_system_limit',
                          ].includes(limit.type) &&
                            formatLimitRaw({ ...limit, available: true })}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </Wrapper>
    </Layout>
  );
}
