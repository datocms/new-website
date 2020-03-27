import {
  gqlStaticPaths,
  gqlStaticProps,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';
import gql from 'graphql-tag';

export const generatePaths = query =>
  gqlStaticPaths(
    gql`
    query {
      posts: ${query}(first: 15, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
    'slug',
    ({ posts }) => posts.map(p => p.slug),
  );

export const generateProps = query =>
  gqlStaticProps(
    gql`
    query EnterpriseAppQuery($slug: String!) {
      page: ${query}(filter: { slug: { eq: $slug } }) {
        title
        shortDescription
        description
        logo {
          url
          width
          height
        }
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        gallery {
          id
          responsiveImage(imgixParams: { h: 300 }) {
            ...imageFields
          }
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
          ... on CodeBlockRecord {
            id
            _modelApiKey
            code
            language
            highlightLines
            showLineNumbers
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
  );
