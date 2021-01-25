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
import { useRouter } from 'next/router';
import { Line, Copy, Image } from 'components/FakeContent';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import { useQuerySubscription } from 'react-datocms';
import PostContent from 'components/PostContent';

import s from 'pages/product-updates/p/[page]/style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allChangelogEntries(first: 10, orderBy: publicationDate_DESC) {
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
                responsiveImage(imgixParams: { w: 1200 }) {
                  ...imageFields
                }
                url
              }
            }
          }
        }
        publicationDate
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
);

export default function Changelog({ preview, subscription }) {
  const { isFallback } = useRouter();

  const {
    data: { post },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      {!isFallback && <Head>{renderMetaTags(post.seo)}</Head>}

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
          <div className={s.info}>
            {isFallback ? (
              <Line />
            ) : (
              <FormattedDate date={post.publicationDate} />
            )}
          </div>
          <h6 className={s.title}>
            {isFallback ? (
              <Copy lines={2} />
            ) : (
              <Link key={post.slug} href={`/product-updates/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            )}
          </h6>
          <div className={s.categories}>
            {post &&
              post.categories.map((cat) => (
                <span
                  key={cat.name}
                  className={s.category}
                  style={{ backgroundColor: cat.color.hex }}
                >
                  {cat.name}
                </span>
              ))}
          </div>

          <div className={s.body}>
            <PostContent
              isFallback={isFallback}
              content={post && post.content}
            />
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
