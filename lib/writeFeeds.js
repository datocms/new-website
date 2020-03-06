import blogFeed from './blogFeed';
import changelogFeed from './changelogFeed';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

export default async function writeFeeds() {
  const [blog, changelog] = await Promise.all([blogFeed(), changelogFeed()]);

  await writeFileAsync('./public/blog.xml', blog, 'utf8');
  await writeFileAsync('./public/product-changelog.xml', changelog, 'utf8');
}

writeFeeds();
