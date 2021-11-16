import generateBlogFeed from './blogFeed';
import generateChangelogFeed from './changelogFeed';
import {
  generateStaticRoutesSitemap,
  generateBlogSitemap,
  generateDocsSitemap,
  generateMarketplaceSitemap,
  generateProductUpdatesSitemap,
} from './sitemap';
import fs from 'fs';
import { promisify } from 'util';
import dotenvLoad from 'dotenv-load';

dotenvLoad();

const writeFileAsync = promisify(fs.writeFile);

export default async function writeFeedsAndSitemap() {
  const [
    blog,
    changelog,
    sitemap,
    blogSitemap,
    docsSitemap,
    productUpdatesSitemap,
    marketplaceSitemap,
  ] = await Promise.all([
    generateBlogFeed(),
    generateChangelogFeed(),
    generateStaticRoutesSitemap(),
    generateBlogSitemap(),
    generateDocsSitemap(),
    generateProductUpdatesSitemap(),
    generateMarketplaceSitemap(),
  ]);

  await writeFileAsync('./public/blog.xml', blog, 'utf8');
  await writeFileAsync('./public/product-changelog.xml', changelog, 'utf8');
  await writeFileAsync('./public/sitemap.xml', sitemap, 'utf8');
  await writeFileAsync('./public/sitemap-blog.xml', blogSitemap, 'utf8');
  await writeFileAsync('./public/sitemap-docs.xml', docsSitemap, 'utf8');
  await writeFileAsync(
    './public/sitemap-product-updates.xml',
    productUpdatesSitemap,
    'utf8',
  );
  await writeFileAsync(
    './public/sitemap-marketplace.xml',
    marketplaceSitemap,
    'utf8',
  );
}

writeFeedsAndSitemap().catch((error) => {
  console.error(error);
  console.error(error.stack);
});
