import Layout from 'components/Layout';
import UseCaseRecap from 'components/UseCaseRecap';
import { highlightHtml } from 'components/Highlight';
import parse from 'html-react-parser';
import UseCaseHead from 'components/UseCaseHead';
import Numbers, { Block as NumbersBlock } from 'components/UseCaseNumbers';
import Results, { Block as ResultsBlock } from 'components/UseCaseResults';
import s from './style.module.css';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import gql from 'graphql-tag';
import { renderMetaTags } from 'react-datocms';
import PostContent from 'components/PostContent';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      posts: allSuccessStories(first: 15, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map(p => p.slug),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query($slug: String!) {
      post: successStory(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...seoMetaTagsFields
        }
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        title(markdown: true)
        coverImage {
          url
        }
        logo {
          url
        }
        challenge(markdown: true)
        result(markdown: true)
        numbers {
          number
          label
        }
        mainResultsImage {
          url
        }
        mainResults {
          title
          description
        }
        content {
          ... on TextRecord {
            id
            _modelApiKey
            text(markdown: true)
          }
          ... on ImageRecord {
            id
            _modelApiKey
            image {
              format
              width
              responsiveImage(imgixParams: { w: 810 }) {
                ...imageFields
              }
              url
            }
          }
          ... on VideoRecord {
            id
            _modelApiKey
            video {
              url
              title
              provider
              width
              height
              providerUid
            }
          }
          ... on InternalVideoRecord {
            id
            _modelApiKey
            autoplay
            loop
            thumbTimeSeconds
            video {
              title
              width
              height
              video {
                duration
                streamingUrl
                thumbnailUrl
              }
            }
          }
          ... on QuoteRecord {
            id
            _modelApiKey
            quote(markdown: true)
            author
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
);

export default function UseCase({ post, preview }) {
  const colors =
    post &&
    [post.duotoneColor1.hex, post.duotoneColor2.hex]
      .map(x => x.replace(/#/, ''))
      .join(',');
  const duotone = `duotone=${colors}`;

  return (
    <Layout preview={preview}>
      {post && (
        <>
          {renderMetaTags(post._seoMetaTags)}
          <div
            style={{
              '--gradient1': post.duotoneColor1.hex,
              '--gradient2': post.duotoneColor2.hex,
              '--useCaseAccent': post.accentColor.hex,
            }}
          >
            <UseCaseHead
              title={parse(post.title)}
              logo={post.logo.url}
              image={`${post.coverImage.url}?${duotone}`}
            />

            <UseCaseRecap
              challenge={highlightHtml(post.challenge)}
              result={highlightHtml(post.result)}
            >
              <Numbers>
                {post.numbers.map(number => (
                  <NumbersBlock key={number.label} title={number.number}>
                    {number.label}
                  </NumbersBlock>
                ))}
              </Numbers>
            </UseCaseRecap>

            <Results image={`${post.mainResultsImage.url}?${duotone}`}>
              {post.mainResults.map(res => (
                <ResultsBlock key={res.title} title={res.title}>
                  {res.description}
                </ResultsBlock>
              ))}
            </Results>

            <div className={s.fullStory}>
              <PostContent content={post.content} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
