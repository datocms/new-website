import generateBlogFeed from './blogFeed';
import generateChangelogFeed from './changelogFeed';
import generateSitemap from './sitemap';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

export default async function writeFeedsAndSitemap() {
  const [blog, changelog, sitemap] = await Promise.all([
    generateBlogFeed(),
    generateChangelogFeed(),
    generateSitemap(),
  ]);

  await writeFileAsync('./public/blog.xml', blog, 'utf8');
  await writeFileAsync('./public/product-changelog.xml', changelog, 'utf8');
  await writeFileAsync('./public/sitemap.xml', sitemap, 'utf8');
}

writeFeedsAndSitemap();
