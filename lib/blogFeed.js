import RSS from 'rss';
import { request } from './datocms';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { render as toHtml } from 'datocms-structured-text-to-html-string';

const query = `
  {
    articles: allBlogPosts(orderBy: publicationDate_DESC, first: 10) {
      slug
      title
      coverImage {
        url
      }
      publicationDate
      author {
        name
        avatar {
          url
        }
      }
      excerpt { value }
      content {
        value
        blocks {
          ... on TypeformRecord {
            id
            _modelApiKey
            typeform
          }
          ... on ImageRecord {
            id
            _modelApiKey
            image {
              url
            }
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
          ... on QuestionAnswerRecord {
            id
            _modelApiKey
            question(markdown: true)
            answer(markdown: true)
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

  var feed = new RSS({
    title: 'DatoCMS Blog',
    description:
      'Where we post product updates and publish articles on topics such as digital publishing, content strategy, and software development.',
  });

  for (let article of articles) {
    feed.item({
      title: article.title,
      date: new Date(article.publicationDate),
      description: toPlainText(article.excerpt),
      url: `https://www.datocms.com/blog/${article.slug}`,
      guid: `https://www.datocms.com/blog/${article.slug}`,
      language: 'en',
      custom_elements: [
        {
          'content:encoded': toHtml(article.content, {
            renderBlock: ({ record }) => {
              if (record._modelApiKey === 'internal_video') {
                return `<img src="${record.video.video.thumbnailUrl}?time=${
                  record.thumbTimeSeconds || record.video.video.duration / 2
                }&width=900" />`;
              }

              if (record._modelApiKey === 'question_answer') {
                return record.question + record.answer;
              }

              if (record._modelApiKey === 'image') {
                return `<img src="${record.image.url}?auto=format&w=900" />`;
              }

              if (record._modelApiKey === 'demo') {
                return `
                  <p>
                    Try the full-fledged "${
                      record.demo.name
                    }" DatoCMS demo project in minutes:
                  </p>
                  <p>
                    <a href="${`https://dashboard.datocms.com/deploy?repo=${record.demo.githubRepo}`}">Deploy the demo project</a>
                  </p>
                `;
              }

              if (record._modelApiKey === 'typeform') {
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
