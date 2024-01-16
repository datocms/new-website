import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
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
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
            ...imageFields
          }
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
  );
