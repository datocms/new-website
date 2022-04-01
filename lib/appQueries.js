import {
  gqlStaticPaths,
  gqlStaticProps,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';

export const generatePaths = (query) =>
  gqlStaticPaths(
    `
    query {
      posts: ${query}(first: 15, orderBy: _firstPublishedAt_DESC) {
        slug
      }
    }
  `,
    'slug',
    ({ posts }) => posts.map((p) => p.slug),
  );

export const generateProps = (query) =>
  gqlStaticProps(
    /* GraphQL */
    `
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
