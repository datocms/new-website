import { render as toHtml } from 'datocms-structured-text-to-html-string';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import RSS from 'rss';
import { request } from './datocms';

const query = `
  {
    articles: allBlogPosts(orderBy: _firstPublishedAt_DESC, first: 10) {
      slug
      title
      coverImage {
        url
      }
      _firstPublishedAt
      author {
        name
        avatar {
          url
        }
      }
      excerpt { value }
      content {
        value
        links {
          ... on BlogPostRecord {
            id
            slug
            title
            __typename
          }
          ... on ChangelogEntryRecord {
            id
            slug
            title
            __typename
          }
        }
        blocks {
          ... on ShowcaseProjectBlockRecord {
            id
            _modelApiKey
            showcaseProjects {
              partner {
                name
                slug
              }
              headline { value }
              name
              slug
            }
          }
          ... on CodesandboxEmbedBlockRecord {
            id
            _modelApiKey
            slug
          }
          ... on ImageRecord {
            id
            _modelApiKey
            image {
              url
            }
          }
          ... on CtaButtonRecord {
            id
            _modelApiKey
            text
            url
          }
          ... on MultipleDemosBlockRecord {
            id
            _modelApiKey
            demos {
              name
              githubRepo
              technology {
                name
              }
            }
          }
          ... on DemoRecord {
            id
            _modelApiKey
            demo {
              name
              githubRepo
              technology {
                name
              }
            }
          }
          ... on InternalVideoRecord {
            id
            _modelApiKey
            thumbTimeSeconds
            video {
              video {
                duration
                thumbnailUrl
              }
            }
          }
          ... on VideoRecord {
            id
            _modelApiKey
            video {
              url
              title
              providerUid
            }
          }
          ... on TableRecord {
            id
            _modelApiKey
            table
          }
          ... on QuestionAnswerRecord {
            id
            _modelApiKey
            question { value }
            answer { value }
          }
        }
      }
    }
  }
`;

export default async function blogFeed() {
  const {
    data: { articles },
  } = await request({ query });

  const feed = new RSS({
    title: 'DatoCMS Blog',
    description:
      'Where we publish articles on topics such as digital publishing, content strategy, and software development.',
  });

  for (const article of articles) {
    feed.item({
      title: article.title,
      date: new Date(article._firstPublishedAt),
      description: toPlainText(article.excerpt),
      url: `https://www.datocms.com/blog/${article.slug}`,
      guid: `https://www.datocms.com/blog/${article.slug}`,
      language: 'en',
      custom_elements: [
        {
          'content:encoded': toHtml(article.content, {
            renderInlineRecord: ({ record, adapter: { renderNode } }) => {
              switch (record.__typename) {
                case 'BlogPostRecord':
                  return renderNode(
                    'a',
                    { href: `/blog/${record.slug}` },
                    record.title,
                  );
                case 'ChangelogEntryRecord':
                  return renderNode(
                    'a',
                    { href: `/product-updates/${record.slug}` },
                    record.title,
                  );
                default:
                  return null;
              }
            },
            renderLinkToRecord: ({
              record,
              children,
              adapter: { renderNode },
            }) => {
              switch (record.__typename) {
                case 'BlogPostRecord':
                  return renderNode(
                    'a',
                    { href: `/blog/${record.slug}` },
                    children,
                  );
                case 'ChangelogEntryRecord':
                  return renderNode(
                    'a',
                    { href: `/product-updates/${record.slug}` },
                    children,
                  );
                default:
                  return null;
              }
            },
            renderBlock: ({
              record,
              adapter: { renderNode, renderFragment },
            }) => {
              if (record._modelApiKey === 'internal_video') {
                return renderNode('img', {
                  src: `${record.video.video.thumbnailUrl}?time=${
                    record.thumbTimeSeconds || record.video.video.duration / 2
                  }&width=900`,
                });
              }

              if (record._modelApiKey === 'question_answer') {
                return toHtml(record.question) + toHtml(record.answer);
              }

              if (record._modelApiKey === 'question_answer') {
                return renderNode(
                  'ul',
                  {},
                  block.showcaseProjects.map((project) =>
                    renderNode(
                      'a',
                      {
                        key: project.slug,
                        href: `/partners/${project.partner.slug}/showcase/${project.slug}`,
                      },
                      `"${project.name}" by ${project.partner.name}`,
                    ),
                  ),
                );
              }

              if (record._modelApiKey === 'image') {
                return renderNode('img', {
                  src: `${record.image.url}?auto=format&w=900`,
                });
              }

              if (record._modelApiKey === 'cta_button') {
                return renderNode(
                  'p',
                  {},
                  renderNode('a', { href: record.url }, record.text),
                );
              }

              if (record._modelApiKey === 'demo') {
                return renderFragment([
                  renderNode(
                    'p',
                    {},
                    `Try the full-fledged "${record.demo.name}" DatoCMS demo project in minutes:`,
                  ),
                  renderNode(
                    'p',
                    {},
                    renderNode(
                      'a',
                      {
                        href: `https://dashboard.datocms.com/deploy?repo=${record.demo.githubRepo}`,
                      },
                      'Deploy the demo project',
                    ),
                  ),
                ]);
              }

              if (record._modelApiKey === 'codesandbox_embed_block') {
                return '';
              }
            },
          }),
        },
      ],
    });
  }

  return feed.xml({ indent: true });
}
