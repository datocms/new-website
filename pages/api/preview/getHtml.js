import { SiteClient } from 'datocms-client';
import got from 'got';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

// this "routing" function knows how to convert a DatoCMS record
// into its canonical URL within the website

const recordToSlugAndUrl = async (record, model) => {
  switch (model.apiKey) {
    case 'blog_post':
      return [record.slug, `/blog/${record.slug}`];
    case 'landing_page':
      return [record.slug, `/cms/${record.slug}`];
    case 'changelog_entry':
      return [record.slug, `/product-updates/${record.slug}`];
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

  const [slug, url] = await recordToSlugAndUrl(record, model);

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

  const { document } = new JSDOM(body).window;
  const reader = new Readability(document);
  const analysis = reader.parse();

  const locale = document.querySelector('html').getAttribute('lang') || 'en';
  const title = document.querySelector('title').textContent;
  const description = document
    .querySelector('meta[name="description"]')
    .getAttribute('content');

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  res
    .status(200)
    .json({ locale, slug, title, description, content: analysis.content });
};

export default handler;
