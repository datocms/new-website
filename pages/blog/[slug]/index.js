import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image, renderMetaTags } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import InterstitialTitle from 'components/InterstitialTitle';
import PostContent from 'components/PostContent';
import Head from 'next/head';
import s from './style.module.css';
import { Line, Copy, Rect } from 'components/FakeContent';
import { useRouter } from 'next/router';
import { useQuerySubscription } from 'react-datocms';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allBlogPosts(first: 10, orderBy: _firstPublishedAt_DESC) {
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
            title
            alt
            responsiveImage(imgixParams: { w: 1200 }) {
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
        ... on QuestionAnswerRecord {
          id
          _modelApiKey
          question(markdown: true)
          answer(markdown: true)
        }
        ... on CodeBlockRecord {
          id
          _modelApiKey
          code
          language
          highlightLines
          showLineNumbers
        }
      }
      _firstPublishedAt
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
);

export default function Article({ preview, subscription }) {
  const { isFallback } = useRouter();

  const {
    data: { post },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      {!isFallback && (
        <Head>
          {renderMetaTags(post._seoMetaTags)}
          {post._firstPublishedAt && (
            <meta
              property="article:published_time"
              content={new Date(post._firstPublishedAt).toISOString()}
            />
          )}
        </Head>
      )}
      <InterstitialTitle kicker="The DatoCMS Blog" style="two">
        {isFallback ? <Copy lines={2} /> : post.title}
      </InterstitialTitle>
      <div className={s.wrapper}>
        <Wrapper>
          <div className={s.info}>
            {isFallback ? (
              <Rect className={s.avatar} />
            ) : (
              <Image
                className={s.avatar}
                data={post.author.avatar.responsiveImage}
              />
            )}
            {isFallback ? (
              <Line />
            ) : (
              <>
                Posted on <FormattedDate date={post._firstPublishedAt} /> by{' '}
                {post.author.name}
              </>
            )}
          </div>

          <PostContent isFallback={isFallback} content={post && post.content} />
        </Wrapper>
      </div>
    </Layout>
  );
}
