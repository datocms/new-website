// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from 'fs';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { promisify } from 'util';
import dotenvLoad from 'dotenv-load';
import generateBlogFeed from './blogFeed';
import generateChangelogFeed from './changelogFeed';
import {
  generateAcademySitemap,
  generateBlogSitemap,
  generateCompareSitemap,
  generateDocsSitemap,
  generateMarketplaceSitemap,
  generatePartnersSitemap,
  generateProductUpdatesSitemap,
  generateSitemapIndex,
  generateStaticRoutesSitemap,
  generateUserGuidesSitemap,
} from './sitemap';

dotenvLoad();

const writeFileAsync = promisify(fs.writeFile);

export default async function writeFeedsAndSitemap() {
  const [
    blogFeed,
    changelogFeed,
    staticSitemap,
    blogSitemap,
    partnersSitemap,
    docsSitemap,
    productUpdatesSitemap,
    marketplaceSitemap,
    academySitemap,
    userGuidesSitemap,
    compareSitemap,
    sitemapIndex,
  ] = await Promise.all([
    generateBlogFeed(),
    generateChangelogFeed(),
    generateStaticRoutesSitemap(),
    generateBlogSitemap(),
    generatePartnersSitemap(),
    generateDocsSitemap(),
    generateProductUpdatesSitemap(),
    generateMarketplaceSitemap(),
    generateAcademySitemap(),
    generateUserGuidesSitemap(),
    generateCompareSitemap(),
    generateSitemapIndex(),
  ]);

  await writeFileAsync('./public/blog.xml', blogFeed, 'utf8');
  await writeFileAsync('./public/product-changelog.xml', changelogFeed, 'utf8');
  await writeFileAsync('./public/sitemap-static.xml', staticSitemap, 'utf8');
  await writeFileAsync(
    './public/sitemap-partners.xml',
    partnersSitemap,
    'utf8',
  );
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
  await writeFileAsync('./public/sitemap-academy.xml', academySitemap, 'utf8');
  await writeFileAsync(
    './public/sitemap-user-guides.xml',
    userGuidesSitemap,
    'utf8',
  );
  await writeFileAsync('./public/sitemap-compare.xml', compareSitemap, 'utf8');
  await writeFileAsync('./public/sitemap.xml', sitemapIndex, 'utf8');
}

writeFeedsAndSitemap().catch((error) => {
  console.error(error);
  console.error(error.stack);
  process.exit(1);
});
