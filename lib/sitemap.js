import { SitemapIndexStream, SitemapStream, streamToPromise } from 'sitemap';
import {
  academyRoutes,
  blogRoutes,
  compareRoutes,
  customerRoutes,
  docsRoutes,
  marketplaceRoutes,
  partnerRoutes,
  productUpdatesRoutes,
  sitemapSlugs,
  staticRoutesToIndex,
} from './routes';

const hostname = 'https://www.datocms.com';

const generateSitemap = async (routes) => {
  if (routes.length === 0) {
    return '';
  }

  const sitemap = new SitemapStream({ hostname });
  for (const route of routes) {
    sitemap.write(route);
  }
  sitemap.end();

  const sm = await streamToPromise(sitemap);
  return sm.toString();
};

export async function generateSitemapIndex() {
  const smis = new SitemapIndexStream();
  for (const slug of sitemapSlugs) {
    smis.write(`${hostname}/${slug}.xml`);
  }
  smis.end();
  const sm = await streamToPromise(smis);
  return sm.toString();
}

export async function generateStaticRoutesSitemap() {
  return generateSitemap(await staticRoutesToIndex());
}

export async function generatePartnersSitemap() {
  return generateSitemap([
    ...(await partnerRoutes()),
    ...(await customerRoutes()),
  ]);
}

export async function generateBlogSitemap() {
  return generateSitemap(await blogRoutes());
}

export async function generateMarketplaceSitemap() {
  return generateSitemap(await marketplaceRoutes());
}

export async function generateDocsSitemap() {
  return generateSitemap(await docsRoutes());
}

export async function generateProductUpdatesSitemap() {
  return generateSitemap(await productUpdatesRoutes());
}

export async function generateAcademySitemap() {
  return generateSitemap(await academyRoutes());
}

export async function generateCompareSitemap() {
  return generateSitemap(await compareRoutes());
}
