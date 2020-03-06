import gql from 'graphql-tag';
import RSS from 'rss';
import { request } from './datocms';
import stripTags from 'striptags';

const query = gql`
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
      excerpt(markdown: true)
      content {
        ... on TypeformRecord {
          id
          _modelApiKey
          typeform
        }
        ... on TextRecord {
          id
          _modelApiKey
          text(markdown: true)
        }
        ... on ImageRecord {
          id
          _modelApiKey
          image {
            url
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
        ... on QuoteRecord {
          id
          _modelApiKey
          quote(markdown: true)
          author
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
      description: stripTags(article.excerpt),
      url: `https://www.datocms.com/blog/${article.slug}`,
      guid: `https://www.datocms.com/blog/${article.slug}`,
      language: 'en',
      custom_elements: [
        {
          'content:encoded': article.content
            .map(block => {
              if (block._modelApiKey === 'text') {
                return block.text;
              }

              if (block._modelApiKey === 'quote') {
                return block.quote;
              }

              if (block._modelApiKey === 'internal_video') {
                return `<img src="${
                  block.video.video.thumbnailUrl
                }?time=${block.thumbTimeSeconds ||
                  block.video.video.duration / 2}&width=900" />`;
              }

              if (block._modelApiKey === 'question_answer') {
                return block.question + block.answer;
              }

              if (block._modelApiKey === 'image') {
                return `<img src="${block.image.url}?auto=format&w=900" />`;
              }

              if (block._modelApiKey === 'typeform') {
                return '';
              }
            })
            .join('\n'),
        },
      ],
    });
  }

  return feed.xml({ indent: true });
}
