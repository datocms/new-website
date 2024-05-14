import RSS from 'rss';
import { request } from './datocms';
import {
  render as toPlainText,
  renderRule,
} from 'datocms-structured-text-to-plain-text';
import { render as toHtml } from 'datocms-structured-text-to-html-string';
import { isBlock } from 'datocms-structured-text-utils';

const query = `
  {
    articles: allChangelogEntries(orderBy: _firstPublishedAt_DESC, first: 10) {
      title
      slug
      content { value }
      _firstPublishedAt
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
      date: new Date(article._firstPublishedAt),
      description: toPlainText(article.content),
      url: `https://www.datocms.com/changelog/${article.slug}/`,
      guid: `https://www.datocms.com/changelog/${article.slug}/`,
      custom_elements: [
        {
          'content:encoded': toHtml(article.content, {
            customRules: [renderRule(isBlock, () => '')],
          }),
        },
      ],
    });
  }

  return feed.xml({ indent: true });
}
