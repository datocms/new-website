import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { gqlStaticPaths, gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import FormattedDate from 'components/FormattedDate';
import SmartMarkdown from 'components/SmartMarkdown';
import { CHANGELOG_POSTS_PER_PAGE } from 'lib/sitemap';
import Paginator from 'components/Paginator';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';

import { range } from 'range';
import gql from 'graphql-tag';

import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      meta: _allChangelogEntriesMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(1, Math.ceil(meta.count / parseFloat(CHANGELOG_POSTS_PER_PAGE))),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query($first: IntType!, $skip: IntType!) {
      changelog {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      posts: allChangelogEntries(
        first: $first
        skip: $skip
        orderBy: publicationDate_DESC
      ) {
        title
        slug
        content(markdown: true)
        publicationDate
        categories {
          name
          color {
            hex
          }
        }
      }

      meta: _allChangelogEntriesMeta {
        count
      }
    }

    ${seoMetaTagsFields}
  `,
  ({ page }) => ({
    first: CHANGELOG_POSTS_PER_PAGE,
    skip: CHANGELOG_POSTS_PER_PAGE * parseInt(page),
  }),
  (data) => ({
    ...data,
    perPage: CHANGELOG_POSTS_PER_PAGE,
  }),
);

export default function Changelog({
  posts,
  changelog,
  perPage,
  preview,
  meta,
}) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      <Head>{!router.isFallback && renderMetaTags(changelog.seo)}</Head>

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
        <div>
          {posts &&
            posts.map((post) => (
              <div key={post.slug} className={s.post}>
                <div className={s.info}>
                  <FormattedDate date={post.publicationDate} />
                </div>
                <h6 className={s.title}>
                  <Link
                    key={post.slug}
                    href="/product-updates/[slug]"
                    as={`/product-updates/${post.slug}`}
                  >
                    <a>{post.title}</a>
                  </Link>
                </h6>
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

                <div className={s.body}>
                  <SmartMarkdown imageClassName={s.responsiveImage}>
                    {post.content}
                  </SmartMarkdown>
                </div>
              </div>
            ))}
        </div>
        {!router.isFallback && (
          <Paginator
            perPage={perPage}
            currentPage={router.query ? parseInt(router.query.page) : 0}
            totalEntries={meta.count}
            href={(index) =>
              index === 0 ? '/product-updates' : '/product-updates/p/[page]'
            }
            as={(index) =>
              index === 0 ? '/product-updates' : `/product-updates/p/${index}`
            }
          />
        )}
      </Wrapper>
    </Layout>
  );
}
