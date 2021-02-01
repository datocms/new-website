import Layout from 'components/Layout';
import UseCaseRecap from 'components/UseCaseRecap';
import { highlightStructuredText } from 'components/Highlight';
import UseCaseHead from 'components/UseCaseHead';
import Wrapper from 'components/Wrapper';
import Numbers, { Block as NumbersBlock } from 'components/UseCaseNumbers';
import Results, { Block as ResultsBlock } from 'components/UseCaseResults';
import s from './style.module.css';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { renderMetaTags, StructuredText } from 'react-datocms';
import PostContent from 'components/PostContent';
import Head from 'next/head';
import { useQuerySubscription } from 'react-datocms';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allSuccessStories(first: 100, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map((p) => p.slug),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($slug: String!) {
      post: successStory(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
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
        title { value }
        coverImage {
          url
        }
        logo {
          url
        }
        challenge { value }
        result { value }
        numbers {
          number
          label
        }
        mainResultsImage {
          url
        }
        mainResults {
          title
          description { value }
        }
        content {
          value
          blocks {
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
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
);

export default function UseCase({ subscription, preview }) {
  const {
    data: { post },
  } = useQuerySubscription(subscription);

  const colors =
    post &&
    [post.duotoneColor1.hex, post.duotoneColor2.hex]
      .map((x) => x.replace(/#/, ''))
      .join(',');
  const duotone = `duotone=${colors}`;

  return (
    <Layout preview={preview}>
      {post && (
        <>
          <Head>{renderMetaTags(post.seo)}</Head>
          <div
            style={{
              '--gradient1': post.duotoneColor1.hex,
              '--gradient2': post.duotoneColor2.hex,
              '--useCaseAccent': post.accentColor.hex,
            }}
          >
            <UseCaseHead
              title={post.title}
              logo={post.logo.url}
              image={`${post.coverImage.url}?${duotone}`}
            />

            <div id="usecase" />

            <UseCaseRecap
              challenge={highlightStructuredText(post.challenge)}
              result={highlightStructuredText(post.result)}
            >
              <Numbers>
                {post.numbers.map((number) => (
                  <NumbersBlock key={number.label} title={number.number}>
                    {number.label}
                  </NumbersBlock>
                ))}
              </Numbers>
            </UseCaseRecap>

            <Results image={`${post.mainResultsImage.url}?${duotone}`}>
              {post.mainResults.map((res) => (
                <ResultsBlock key={res.title} title={res.title}>
                  <StructuredText data={res.description} />
                </ResultsBlock>
              ))}
            </Results>

            <Wrapper>
              <div className={s.fullStory}>
                <PostContent content={post.content} />
              </div>
            </Wrapper>
          </div>
        </>
      )}
    </Layout>
  );
}
