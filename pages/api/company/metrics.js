import tiny from 'tiny-json-http';

export default async (_req, res) => {
  const { body: data } = await tiny.get({
    url: `https://api.profitwell.com/v2/metrics/monthly/?metrics=recurring_revenue,average_revenue_per_user,active_customers`,
    headers: {
      Authorization: process.env.PROFITWELL_API_KEY,
    },
  });

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  res.status(200).json(data);
};
