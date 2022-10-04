import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import InterstitialTitle from 'components/InterstitialTitle';
import PostContent from 'components/PostContent';
import Head from 'components/Head';
import s from './style.module.css';
import { useQuerySubscription } from 'react-datocms';
import filter from 'utils/filterNodes';
import { isHeading } from 'datocms-structured-text-utils';
import slugify from 'utils/slugify';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allBlogPosts(first: 10, orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map((p) => p.slug),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query ArticleQuery($slug: String!) {
      post: blogPost(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        title
        seoH1
        canonicalUrl
        yoastAnalysis
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
            ... on ImageRecord {
              id
              _modelApiKey
              image {
                format
                width
                height
                title
                alt
                responsiveImage(imgixParams: { w: 950 }, sizes: "(max-width: 810px) 100vw, (max-width: 1000px) 750px, (min-width: 1001px) 950px") {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(imgixParams: { w: 1500, fit: max}) {
                  ...imageFields
                }
                url
              }
            }
            ... on TypeformRecord {
              id
              _modelApiKey
            }
            ... on CodesandboxEmbedBlockRecord {
              id
              _modelApiKey
              slug
              preview {
                responsiveImage(imgixParams: { h: 500 }) {
                  ...imageFields
                }
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
                id
                name
                code
                technology {
                  name
                  logo {
                    url
                  }
                }
                screenshot {
                  responsiveImage(
                    imgixParams: { w: 400, h: 300, fit: crop, crop: top }
                  ) {
                    ...imageFields
                  }
                }
              }
            }
            ... on DemoRecord {
              id
              _modelApiKey
              demo {
                id
                name
                code
                githubRepo
                technology {
                  name
                  logo {
                    url
                  }
                }
                screenshot {
                  responsiveImage(
                    imgixParams: { w: 450, h: 350, fit: crop, crop: top }
                  ) {
                    ...imageFields
                  }
                }
              }
            }
            ... on InternalVideoRecord {
              id
              _modelApiKey
              autoplay
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
            ... on QuestionAnswerRecord {
              id
              _modelApiKey
              question { value }
              answer { value }
            }
          }
        }
        _firstPublishedAt
        _createdAt
        author {
          name
          avatar {
            responsiveImage(
              imgixParams: { w: 50, h: 50, fit: crop, crop: faces }
            ) {
              ...imageFields
            }
          }
        }
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['post'],
  },
);

export default function Article({ preview, subscription }) {
  const {
    data: { post },
  } = useQuerySubscription(subscription);

  const headings = filter(post.content.value.document, isHeading);

  return (
    <Layout preview={preview}>
      <Head canonicalUrl={post.canonicalUrl}>
        {renderMetaTags(post._seoMetaTags)}
        {post._firstPublishedAt && (
          <meta
            property="article:published_time"
            content={new Date(post._firstPublishedAt).toISOString()}
          />
        )}
        <meta
          key="meta-twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
      </Head>
      <InterstitialTitle
        seoAnalysis={post.yoastAnalysis}
        kicker={post.seoH1 || 'The DatoCMS Blog'}
        style="two"
        mainTitleOfPage
      >
        {post.title}
      </InterstitialTitle>
      <div className={s.postWrapper}>
        <Wrapper>
          <div className={s.info}>
            <DatoImage
              className={s.avatar}
              data={post.author.avatar.responsiveImage}
            />
            Posted on{' '}
            <FormattedDate date={post._firstPublishedAt || post._createdAt} />{' '}
            by {post.author.name}
          </div>

          <div id="main-content">
            <PostContent content={post.content} />
          </div>
        </Wrapper>
        {headings.length > 4 && (
          <div className={s.tocWrapper}>
            <div className={s.toc}>
              <div className={s.tocTitle}>In this article:</div>
              <ul>
                {headings.map((heading) => {
                  const innerText = toPlainText(heading);
                  return (
                    <li key={innerText}>
                      <a href={`#${slugify(innerText)}`}>{innerText}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
