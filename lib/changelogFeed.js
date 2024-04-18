import { render as toHtml } from 'datocms-structured-text-to-html-string';
import {
  renderRule,
  render as toPlainText,
} from 'datocms-structured-text-to-plain-text';
import { isBlock } from 'datocms-structured-text-utils';
import RSS from 'rss';
import { request } from './datocms';

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

  const feed = new RSS({
    title: 'DatoCMS Product Changelog',
    description: 'Here we document our progress and announce product updates',
  });

  for (const article of articles) {
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
