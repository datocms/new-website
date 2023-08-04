// this "routing" function knows how to convert a DatoCMS record
// into its slug and canonical URL within the website

import { request } from '../../../lib/datocms';

const findPermalink = async ({ item, itemType }) => {
  switch (itemType.attributes.api_key) {
    case 'blog_post':
      return `/blog/${item.attributes.slug}`;
    case 'landing_page':
      return `/cms/${item.attributes.slug}`;
    case 'changelog_entry':
      return `/product-updates/${item.attributes.slug}`;
    case 'feature':
      return `/features/${item.attributes.slug}`;
    case 'team_page':
      return `/team/${item.attributes.slug}`;
    case 'template_demo':
      return `/marketplace/starters/${item.attributes.code}`;
    case 'partner':
      return `/partners/${item.attributes.slug}`;
    case 'showcase_project': {
      const {
        data: {
          showcaseProject: { partner },
        },
      } = await request({
        query: `
        query PartnerSlug($id: ItemId!) {
          showcaseProject(filter: {id: {eq: $id}}) {
            partner {
              slug
            }
          }
        }`,
        variables: { id: item.id },
        preview: true,
      });

      return `/partners/${partner.slug}/showcase/${item.attributes.slug}`;
    }
    default:
      return null;
  }
};

const handler = async (req, res) => {
  // setup CORS permissions
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // This will allow OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  const { item, itemType, locale } = req.body;

  const permalink = await findPermalink({
    item,
    itemType,
    locale,
  });

  if (!permalink) {
    return res.status(200).json({ previewLinks: [] });
  }

  const domain =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'www.datocms.com'
      : process.env.VERCEL_BRANCH_URL;

  const previewLinks = [
    ...(item.meta.status !== 'draft'
      ? [
          {
            label: 'Published version',
            url: `https://${domain}${permalink}`,
          },
        ]
      : []),
    ...(item.meta.status !== 'published'
      ? [
          {
            label: 'Preview draft version',
            url: `https://${domain}/api/preview/start?slug=${permalink}`,
          },
        ]
      : []),
  ];

  return res.status(200).json({ previewLinks });
};

export default handler;
