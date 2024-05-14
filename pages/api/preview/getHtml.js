import { buildClient } from '@datocms/cma-client';
import got from 'got';
import { JSDOM } from 'jsdom';
import { findPermalink } from './links';

const client = buildClient({
  apiToken: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
});

// this "routing" function knows how to convert a DatoCMS record
// into its slug and canonical URL within the website

const findSlug = async ({ item, itemTypeApiKey }) => {
  switch (itemTypeApiKey) {
    case 'template_demo':
      return item.attributes.code;
    case 'home_page':
      return '/';
    default:
      return item.attributes.slug || null;
  }
};

const findSlugAndPermalink = async ({ item, itemTypeApiKey }) => {
  const permalink = await findPermalink({ item, itemTypeApiKey });
  const slug = await findSlug({ item, itemTypeApiKey });

  if (!permalink || !permalink) {
    return [null, null];
  }

  return [slug, permalink];
};

const handler = async (req, res) => {
  // Setup relaxed CORS permissions

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // this endpoint requires the following parameters parameter, which represent the
  // the record we want to get the preview for

  const missingParams = ['itemId', 'itemTypeId', 'itemTypeApiKey'].filter(
    (paramName) => !req.query[paramName],
  );

  if (missingParams.length > 0) {
    res.status(422).json({
      message: `Missing required parameters! ${missingParams.join(', ')}`,
    });
    return;
  }

  const { itemId, itemTypeId, itemTypeApiKey } = req.query;

  // given the itemId, we can now get the record (and it's model) from the Datocms API
  const { data: item } = await client.items.rawFind(itemId);

  // we can now get the URL for the record using a routing function
  // that knows which record is linked to which URL in the website

  const [slug, permalink] = await findSlugAndPermalink({
    item,
    itemTypeId,
    itemTypeApiKey,
  });

  if (!permalink) {
    res.status(422).json({
      message: `Don\'t know which route corresponds to record #${itemId} of model "${itemTypeApiKey}"!`,
    });
    return;
  }

  // let's start a Next.js Preview Mode (and get the authentication cookies)

  res.setPreviewData({});

  const cookie = res
    .getHeader('Set-Cookie')
    .map((cookie) => cookie.split(';')[0])
    .join(';');

  res.clearPreviewData();

  // final step is to get the HTML of the webpage associated with the record
  // and return it to the client

  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.BASE_URL;

  const { body } = await got(new URL(permalink, baseUrl).toString(), {
    headers: { cookie },
  });

  const { document } = new JSDOM(body).window;

  const contentEl = document.getElementById('main-content');

  if (!contentEl) {
    res.status(422).json({
      message: `Can't find any div with ID=main-content on page ${permalink}, please fix this!`,
    });
    return;
  }

  const content = contentEl.innerHTML;
  const locale = document.querySelector('html').getAttribute('lang') || 'en';
  const title = document.querySelector('title').textContent;
  const description = document
    .querySelector('meta[name="description"]')
    .getAttribute('content');

  res.status(200).json({
    locale,
    slug,
    permalink,
    title,
    description,
    content,
  });
};

export default handler;
