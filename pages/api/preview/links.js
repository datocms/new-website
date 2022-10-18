// this "routing" function knows how to convert a DatoCMS record
// into its slug and canonical URL within the website

const findPermalink = ({ item, itemType, locale }) => {
  const localePrefix = locale === 'en' ? '' : `/${locale}`;

  switch (itemType.attributes.api_key) {
    case 'blog_post':
      return `${localePrefix}/blog/${item.attributes.slug}`;
    case 'landing_page':
      return `${localePrefix}/cms/${item.attributes.slug}`;
    case 'changelog_entry':
      return `${localePrefix}/product-updates/${item.attributes.slug}`;
    case 'feature':
      return `${localePrefix}/features/${item.attributes.slug}`;
    case 'team_page':
      return `${localePrefix}/team/${item.attributes.slug}`;
    case 'template_demo':
      return `${localePrefix}/marketplace/starters/${item.attributes.code}`;
    default:
      return null;
  }
};

const handler = (req, res) => {
  // setup CORS permissions
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // This will allow OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  const { item, itemType, sandboxEnvironmentId, locale, name } = req.body;

  const permalink = findPermalink({
    item,
    itemType,
    locale,
  });

  if (!permalink) {
    return res.status(200).json({ urls: [] });
  }

  const urls = [
    {
      label: `${name} (${locale})`,
      url: `https://www.datocms.com/${permalink}`,
    },
    {
      label: `Draft ${name} (${locale})`,
      url: `https://www.datocms.com/api/preview/start?slug=${permalink}`,
    },
  ];

  return res.status(200).json({ urls });
};

export default handler;
