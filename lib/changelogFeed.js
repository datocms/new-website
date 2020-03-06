import gql from 'graphql-tag';
import RSS from 'rss';
import { request } from './datocms';
import stripTags from 'striptags';

const query = gql`
  {
    articles: allChangelogEntries(orderBy: publicationDate_DESC, first: 10) {
      title
      slug
      content(markdown: true)
      publicationDate
    }
  }
`;

export default async function changelogFeed() {
  const {
    data: { articles },
  } = await request({ query });

  var feed = new RSS({
    title: 'DatoCMS Product Changelog',
    description: 'Here we document our progress and announce product updates',
  });

  for (let article of articles) {
    feed.item({
      title: article.title,
      date: new Date(article.publicationDate),
      description: stripTags(article.content),
      url: `https://www.datocms.com/changelog/${article.slug}/`,
      guid: `https://www.datocms.com/changelog/${article.slug}/`,
      custom_elements: [{ 'content:encoded': article.content }],
    });
  }

  return feed.xml({ indent: true });
}
