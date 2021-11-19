import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import {
  staticRoutesToIndex,
  blogRoutes,
  marketplaceRoutes,
  docsRoutes,
  productUpdatesRoutes,
  sitemapSlugs,
} from './routes';

const hostname = 'https://www.datocms.com';

const generateSitemap = async (routes) => {
  const sitemap = new SitemapStream({ hostname });
  routes.forEach((route) => sitemap.write(route));
  sitemap.end();

  const sm = await streamToPromise(sitemap);
  return sm.toString();
};

export async function generateSitemapIndex() {
  const smis = new SitemapIndexStream();
  sitemapSlugs.forEach((slug) => smis.write(`${hostname}/${slug}.xml`));
  smis.end();
  const sm = await streamToPromise(smis);
  return sm.toString();
}

export async function generateStaticRoutesSitemap() {
  return generateSitemap(await staticRoutesToIndex());
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
