import { SiteClient } from 'datocms-client';
import { request, imageFields } from 'lib/datocms';

const handler = async (req, res) => {
  const client = new SiteClient(process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN);

  const results = await client.items.all({
    filter: { query: req.query.term, type: 'plugin' },
    page: { limit: 50 },
    order_by: '_rank_DESC',
  });

  const ids = results.map((plugin) => plugin.id);

  const response = await request({
    query: `
      query PluginsFind($ids: [ItemId]!) {
        allPlugins(filter: {id: {in: $ids}}, first: 50) {
          id
          title
          description
          releasedAt
          packageName
          coverImage {
            responsiveImage(imgixParams: { w: 600, h: 400, fit: crop }) {
              ...imageFields
            }
          }
        }
      }

      ${imageFields}
    `,
    variables: {
      ids,
    },
  });

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res
    .status(200)
    .json(ids.map((id) => response.data.allPlugins.find((p) => p.id === id)));
};

export default handler;
