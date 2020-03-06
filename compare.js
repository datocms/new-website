import Sitemapper from 'sitemapper';
import generate from './lib/sitemap';
const { pathToRegexp, match, parse, compile } = require('path-to-regexp');

const redirects = [
  {
    source: '/docs/general-concepts/transfer',
    destination: '/docs/plans-pricing-and-billing/transfer',
  },
  {
    source: '/docs/content-management-api/js-client',
    destination: '/docs/content-management-api/using-the-nodejs-clients',
  },
  {
    source: '/docs/content-management-api/ruby-client',
    destination: '/docs/content-management-api/using-the-ruby-client',
  },
  {
    source: '/docs/security',
    destination: '/legal/security',
  },
  {
    source: '/docs/guides/private-videos',
    destination: '/docs/content-modelling/external-video-field',
  },
  {
    source: '/docs/deployments/custom-webhook',
    destination: '/docs/custom-build-methods',
  },
  {
    source: '/docs/content-delivery-api/endpoint',
    destination: '/docs/content-delivery-api/api-endpoints',
  },
  {
    source: '/docs/content-delivery-api/query_explorer',
    destination: '/docs/content-delivery-api/query-explorer',
  },
  {
    source: '/docs/content-delivery-api/complexity_limiting',
    destination: '/docs/content-delivery-api/complexity',
  },
  {
    source: '/docs/content-delivery-api/first-request',
    destination: '/docs/content-delivery-api/your-first-request',
  },
  {
    source: '/docs/content-delivery-api/querying',
    destination: '/docs/content-delivery-api/how-to-fetch-records',
  },
  {
    source: '/docs/content-delivery-api/filtering',
    destination: '/docs/content-delivery-api/filtering-records',
  },
  {
    source: '/docs/content-delivery-api/ordering',
    destination: '/docs/content-delivery-api/ordering-records',
  },
  {
    source: '/docs/content-delivery-api/modular-content',
    destination: '/docs/content-delivery-api/modular-content-fields',
  },
  {
    source: '/docs/content-delivery-api/uploads',
    destination: '/docs/content-delivery-api/images-and-videos',
  },
  {
    source: '/docs/content-delivery-api/seo',
    destination: '/docs/content-delivery-api/seo-and-favicon',
  },
  {
    source: '/blog/2',
    destination: '/blog/p/2',
  },
  {
    source: '/changelog/2',
    destination: '/product-updates/p/2',
  },
  {
    source: '/changelog/3',
    destination: '/product-updates/p/3',
  },
  {
    source: '/changelog/4',
    destination: '/product-updates/p/4',
  },
  {
    source: '/changelog/5',
    destination: '/product-updates/p/5',
  },
  {
    source: '/changelog/6',
    destination: '/product-updates/p/5',
  },
  {
    source: '/changelog/:rest*',
    destination: '/product-updates/:rest*',
  },
  {
    source: '/docs/general-concepts/pricing',
    destination: '/docs/plans-pricing-and-billing',
  },
  {
    source: '/docs/guides/installing-site-search/:rest*',
    destination: '/docs/site-search/:rest*',
  },
  {
    source: '/docs/guides/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/static-generators/gatsbyjs/:rest*',
    destination: '/docs/gatsby/:rest*',
  },
  {
    source: '/docs/static-generators/other-ssg/:rest*',
    destination: '/docs/other-ssgs/:rest*',
  },
  {
    source: '/docs/static-generators/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/single-page-apps/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/deployments/:rest*',
    destination: '/docs/:rest*',
  },
].map(rule => ({
  ...rule,
  match: match(rule.source),
  toPath: compile(rule.destination),
}));

// const rewrite = (url) =>

async function start() {
  const sitemapper = new Sitemapper();
  sitemapper.timeout = 5000;

  const s1 = await sitemapper.fetch('https://www.datocms.com/sitemap.xml');
  const s2Sites = (
    await sitemapper.fetch('https://new.datocms.com/sitemap.xml')
  ).sites.map(x => x.replace('https://www.datocms.com', '').replace(/\/$/, ''));

  const notFound = s1.sites.filter(url => {
    let realUrl = url.replace('https://www.datocms.com', '').replace(/\/$/, '');
    const redirect = redirects.find(r => r.match(realUrl));

    if (redirect) {
      console.log('/////');
      console.log(realUrl);
      const { params } = redirect.match(realUrl);
      realUrl = redirect.toPath(params);
      console.log(realUrl);
    }

    return !s2Sites.includes(realUrl);
  });

  console.log(notFound);
}

start();
