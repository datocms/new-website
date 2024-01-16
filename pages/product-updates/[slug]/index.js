import FormattedDate from 'components/FormattedDate';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import { renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';

import pageStyle from 'pages/docs/pageStyle.module.css';
import s from 'pages/product-updates/p/[page]/style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allChangelogEntries(first: 10, orderBy: _firstPublishedAt_DESC) {
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
      post: changelogEntry(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title
        slug
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
                title
                alt
                responsiveImage(imgixParams: { auto: format, w: 950 }) {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(imgixParams: { auto: format, w: 1500, fit: max }) {
                  ...imageFields
                }
                url
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
        _firstPublishedAt
        categories {
          name
          color {
            hex
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

export default function Changelog({ preview, subscription }) {
  const {
    data: { post },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(post.seo)}</Head>

      <Hero
        title={
          <>
            <Highlight>Product Updates</Highlight>
          </>
        }
        subtitle={
          <>DatoCMS changelog for new features and general improvements</>
        }
      />

      <Wrapper>
        <div className={s.post}>
          <div className={s.categories}>
            {post.categories.map((cat) => (
              <span
                key={cat.name}
                className={s.category}
                style={{ backgroundColor: cat.color.hex }}
              >
                {cat.name}
              </span>
            ))}
          </div>

          <h6 className={s.title}>
            <Link key={post.slug} href={`/product-updates/${post.slug}`}>
              <a>{post.title}</a>
            </Link>
          </h6>

          <div className={s.info}>
            <FormattedDate date={post._firstPublishedAt} />
          </div>

          <div className={s.body} id="main-content">
            <PostContent content={post.content} style={pageStyle} />
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
