import { SitemapStream, streamToPromise } from 'sitemap';
import {
  staticRoutesToIndex,
  blogRoutes,
  marketplaceRoutes,
  docsRoutes,
  productUpdatesRoutes,
} from './routes';

const generateSitemap = async (routes) => {
  const sitemap = new SitemapStream({ hostname: 'https://www.datocms.com' });
  routes.forEach((route) => sitemap.write(route));
  sitemap.end();

  const sm = await streamToPromise(sitemap);
  return sm.toString();
};

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
