import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';
import Link from 'next/link';
import FormattedDate from 'components/FormattedDate';
import { renderMetaTags } from 'react-datocms';
import Head from 'components/Head';
import { useQuerySubscription } from 'react-datocms';
import PostContent from 'components/PostContent';

import s from 'pages/product-updates/p/[page]/style.module.css';
import pageStyle from 'pages/docs/pageStyle.module.css';

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
              image {
                format
                width
                title
                alt
                responsiveImage(imgixParams: { w: 950 }) {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(imgixParams: { w: 1500, fit: max }) {
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
                video {
                  duration
                  streamingUrl
                  thumbnailUrl
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
