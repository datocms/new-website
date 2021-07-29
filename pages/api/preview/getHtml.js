import { SiteClient } from 'datocms-client';
import got from 'got';

const recordToUrl = async (record, model) => {
  switch (model.apiKey) {
    case 'blog_post':
      return `/blog/${record.slug}`;
    case 'landing_page':
      return `/cms/${record.slug}`;
    case 'changelog_entry':
      return `/product-updates/${record.slug}`;
    default:
      return null;
  }
};

const handler = async (req, res) => {
  const itemId = req.query.itemId;

  if (!itemId) {
    res.status(422).json({ message: 'Missing itemId parameter!' });
    return;
  }

  const client = new SiteClient(
    'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
  );

  const record = await client.items.find(itemId);
  const model = await client.itemTypes.find(record.itemType);

  const url = await recordToUrl(record, model);

  if (!url) {
    res.status(422).json({
      message: `Don\'t know which route corresponds to record #${itemId}!`,
    });
    return;
  }

  const { headers } = await got(
    new URL('/api/preview/start', process.env.BASE_URL).toString(),
    {
      followRedirect: false,
    },
  );

  const cookie = headers['set-cookie']
    .map((cookie) => cookie.split(';')[0])
    .join(';');

  const pageUrl = new URL(url, process.env.BASE_URL);

  const { body } = await got(pageUrl.toString(), { headers: { cookie } });

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  res.status(200).send(body);
};

export default handler;
