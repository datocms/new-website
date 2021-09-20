import { SiteClient } from 'datocms-client';
import got from 'got';
import { JSDOM } from 'jsdom';

const client = new SiteClient(process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN);

// this "routing" function knows how to convert a DatoCMS record
// into its slug and canonical URL within the website

const findSlugAndPermalink = async ({ item, itemTypeApiKey }) => {
  if (item.slug === 'enterprise-headless-cms') {
    return [item.slug, `/${item.slug}`];
  }

  switch (itemTypeApiKey) {
    case 'blog_post':
      return [item.slug, `/blog/${item.slug}`];
    case 'landing_page':
      return [item.slug, `/cms/${item.slug}`];
    case 'changelog_entry':
      return [item.slug, `/product-updates/${item.slug}`];
    case 'feature':
      return [item.slug, `/features/${item.slug}`];
    case 'team_page':
      return [item.slug, `/team/${item.slug}`];
    case 'template_demo':
      return [item.slug, `/marketplace/starters/${item.slug}`];
    default:
      return [null, null];
  }
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
  const item = await client.items.find(itemId);

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

  const { body } = await got(
    new URL(permalink, process.env.BASE_URL).toString(),
    {
      headers: { cookie },
    },
  );

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
