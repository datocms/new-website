import Head from 'components/Head';
import { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import UseCaseHead from 'components/UseCaseHead';
import Numbers, { Block as NumbersBlock } from 'components/UseCaseNumbers';
import UseCaseRecap from 'components/UseCaseRecap';
import Results, { Block as ResultsBlock } from 'components/UseCaseResults';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

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
          focalPoint {
            x
            y
          }
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
          focalPoint {
            x
            y
          }
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
              frameless
              image {
                format
                width
                responsiveImage(imgixParams: { auto: format, w: 810 }) {
                  ...imageFields
                }
                url
              }
            }
            ... on InDepthCtaBlockRecord {
              id
              _modelApiKey
              cta {
                title
                description {
                  value
                }
                ctaLabel
                ctaUrl
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
              thumbTimeSeconds
              video {
                title
                width
                height
                blurUpThumb
                video {
                  playbackId: muxPlaybackId
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
  {
    requiredKeys: ['post'],
  },
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
          image={`${post.coverImage.url}?fp-y=${post.coverImage.focalPoint.y}&fp-x=${post.coverImage.focalPoint.x}&crop=focalpoint&fit=crop&${duotone}`}
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

        <Results
          image={`${post.mainResultsImage.url}?${duotone}&fp-y=${post.mainResultsImage.focalPoint.y}&crop=focalpoint&fp-x=${post.mainResultsImage.focalPoint.x}`}
        >
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
    </Layout>
  );
}
