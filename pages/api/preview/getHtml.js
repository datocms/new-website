import { SiteClient } from 'datocms-client';
import got from 'got';

// this "routing" function knows how to convert a DatoCMS record
// into its canonical URL within the website

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
  // this endpoint requires an itemId parameter, which represent the
  // ID of the record we want to get the preview for

  const itemId = req.query.itemId;

  if (!itemId) {
    res.status(422).json({ message: 'Missing itemId parameter!' });
    return;
  }

  // given the itemId, we can now get the record (and it's model) from the Datocms API

  const client = new SiteClient(
    'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
  );

  const record = await client.items.find(itemId);
  const model = await client.itemTypes.find(record.itemType);

  // we can now get the URL for the record using a routing function
  // that knows which record is linked to which URL in the website

  const url = await recordToUrl(record, model);

  if (!url) {
    res.status(422).json({
      message: `Don\'t know which route corresponds to record #${itemId}!`,
    });
    return;
  }

  // let's start a Next.js Preview Mode (and get the authentication cookies)

  const { headers } = await got(
    new URL('/api/preview/start', process.env.BASE_URL).toString(),
    {
      followRedirect: false,
    },
  );

  const cookie = headers['set-cookie']
    .map((cookie) => cookie.split(';')[0])
    .join(';');

  // final step is to get the HTML of the webpage associated with the record
  // and return it to the client

  const { body } = await got(new URL(url, process.env.BASE_URL).toString(), {
    headers: { cookie },
  });

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  res.status(200).json({ body });
};

export default handler;
