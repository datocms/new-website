import FormattedDate from 'components/FormattedDate';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isHeading } from 'datocms-structured-text-utils';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import filter from 'utils/filterNodes';
import slugify from 'utils/slugify';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

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
  /* GraphQL */ `
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
            ... on TutorialVideoRecord {
              id
              _modelApiKey
              tutorials {
                ... on RecordInterface{
                  id
                  _modelApiKey
                }
                ... on RecordInterface{
                  id
                  _modelApiKey
                }
                ... on UserGuidesVideoRecord {
                  title
                  slug
                  thumbTimeSeconds
                  video {
                    video {
                      thumbnailUrl
                      blurUpThumb
                      width
                      height
                    }
                  }
                  chapters: _allReferencingUserGuidesChapters {
                    slug
                  }
                }
                ... on VideoTutorialRecord {
                  id
                  title
                  res: videoTutorialResource {
                    ... on OtherVideoResourceRecord {
                      _modelApiKey
                      url
                      coverImage {
                        responsiveImage(imgixParams: { auto: format, w: 300, ar: "4:3", fit: crop }) {
                          ...imageFields
                        }
                      }
                    }
                    ... on YoutubeVideoResourceRecord {
                      _modelApiKey
                      video {
                        url
                        thumbnailUrl
                        providerUid
                      }
                    }
                  }
                }
              }
            }
            ... on ShowcaseProjectBlockRecord {
              id
              _modelApiKey
              showcaseProjects {
                partner {
                  name
                  slug
                  logo { url }
                  shortDescription { value }
                }
                headline { value }
                technologies {
                  name
                  logo {
                    url
                  }
                }
                name
                slug
                projectUrl
                mainImage {
                  responsiveImage(
                    imgixParams: { auto: format, w: 850 },
                    sizes: "850px"
                  ) {
                    ...imageFields
                  }
                }
              }
            }
            ... on ImageRecord {
              id
              _modelApiKey
              frameless
              image {
                format
                width
                height
                title
                alt
                responsiveImage(imgixParams: { auto: format, w: 950 }, sizes: "(max-width: 810px) 100vw, (max-width: 1000px) 750px, (min-width: 1001px) 950px") {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(imgixParams: { auto: format, w: 1500, fit: max}) {
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
                responsiveImage(imgixParams: { auto: format, h: 500 }) {
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
                    imgixParams: { auto: format, w: 400, h: 300, fit: crop, crop: top }
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
                    imgixParams: { auto: format, w: 450, h: 350, fit: crop, crop: top }
                  ) {
                    ...imageFields
                  }
                }
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
            ... on QuestionAnswerRecord {
              id
              _modelApiKey
              question { value }
              answer { value }
            }
            ... on TableRecord {
              id
              _modelApiKey
              table
            }
          }
        }
        _firstPublishedAt
        _createdAt
        author {
          name
          avatar {
            responsiveImage(
              imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }
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
