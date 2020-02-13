import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { gqlStaticPaths, gqlStaticProps, imageFields, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
import FormattedDate from 'components/FormattedDate';

import { range } from 'range';
import gql from 'graphql-tag';

import s from './style.css';

const POSTS_PER_PAGE = 10;

export const unstable_getStaticPaths = gqlStaticPaths(
  gql`
    query {
      posts: allBlogPosts(
        first: 15,
        orderBy: _firstPublishedAt_DESC
      ) {
        slug
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map(p => p.slug),
);

export const unstable_getStaticProps = gqlStaticProps(
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
        ... on TypeformRecord {
          id
          _modelApiKey
          typeform
        }
        ... on ImageRecord {
          id
          image {
            responsiveImage(imgixParams: { w: 810 }) {
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
`);

export default function Article({ post }) {
  return (
    <Layout>
      <Wrapper>
        <div className={s.postBody}>
          <h6 className={s.title}>{post.title}</h6>
          <div className={s.footer}>
            <div className={s.date}>
              Posted on <FormattedDate date={post._firstPublishedAt} />
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}