import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { withDato } from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useRouter } from 'next/router';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import s from './style.css';

const QUERY = gql`
  query ArticleQuery($slug: String!) {
    blogPost(filter: { slug: { eq: $slug } }) {
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

  fragment imageFields on ResponsiveImage {
    alt
    title
    base64
    height
    width
    src
    srcSet
    sizes
    aspectRatio
  }

  fragment seoMetaTagsFields on Tag {
    attributes
    content
    tag
  }
`;

function Article() {
  const router = useRouter();

  const { slug } = router.query;

  const { loading, error, data } = useQuery(QUERY, {
    variables: {
      slug,
    },
  });

  if (loading || error) {
    return 'Loading...';
  }

  const { blogPost: post } = data;

  return (
    <Layout>
      <Wrapper>
        <div className={s.postBody}>
          <h6 className={s.title}>{post.title}</h6>
          <div className={s.footer}>
            <div className={s.date}>
              Posted on {format(parseISO(post._firstPublishedAt), 'PPP')}
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default withDato(Article);
