import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image, renderMetaTags } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import gql from 'graphql-tag';
import InterstitialTitle from 'components/InterstitialTitle';
import PostContent from 'components/PostContent';
import Head from 'next/head';
import s from './style.css';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      posts: allBlogPosts(first: 15, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map(p => p.slug),
);

export const getStaticProps = gqlStaticProps(
  gql`
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
          ... on QuestionAnswerRecord {
            id
            _modelApiKey
            question(markdown: true)
            answer(markdown: true)
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

export default function Article({ post, preview }) {
  return (
    <Layout preview={preview}>
      {post && (
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
      <Wrapper>
        <div className={s.root}>
          <InterstitialTitle kicker="The DatoCMS Blog" style="two">
            {post && post.title}
          </InterstitialTitle>

          {post && (
            <>
              <div className={s.info}>
                <Image
                  className={s.avatar}
                  data={post.author.avatar.responsiveImage}
                />
                Posted on <FormattedDate date={post._firstPublishedAt} /> by{' '}
                {post.author.name}
              </div>

              <PostContent content={post.content} />
            </>
          )}
        </div>
      </Wrapper>
    </Layout>
  );
}
