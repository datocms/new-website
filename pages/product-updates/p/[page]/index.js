import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { gqlStaticPaths, gqlStaticProps } from 'lib/datocms';
import Link from 'next/link';
import FormattedDate from 'components/FormattedDate';
import SmartMarkdown from 'components/SmartMarkdown';

import { range } from 'range';
import gql from 'graphql-tag';

import s from './style.css';

const POSTS_PER_PAGE = 10;

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      meta: _allChangelogEntriesMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) => range(1, Math.ceil(meta.count / parseFloat(POSTS_PER_PAGE))),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query($first: IntType!, $skip: IntType!) {
      posts: allChangelogEntries(
        first: $first
        skip: $skip
        orderBy: _firstPublishedAt_DESC
      ) {
        title
        slug
        content(markdown: true)
        _firstPublishedAt
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
  `,
  ({ page }) => ({
    first: POSTS_PER_PAGE,
    skip: POSTS_PER_PAGE * parseInt(page),
  }),
  ({ posts, meta }, { params: { page } }) => ({
    posts,
    prevPage:
      parseInt(page) > 1
        ? `/product-updates/p/${parseInt(page) - 1}`
        : parseInt(page) === 1
        ? `/product-updates`
        : null,
    nextPage:
      (parseInt(page) + 1) * POSTS_PER_PAGE < meta.count
        ? `/product-updates/p/${parseInt(page) + 1}`
        : null,
  }),
);

export default function Changelog({ posts, prevPage, nextPage, preview }) {
  return (
    <Layout preview={preview}>
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
        {posts && posts.map(post => (
          <div key={post.slug} className={s.post}>
            <div className={s.info}>
              <FormattedDate date={post._firstPublishedAt} />
            </div>
            <h6 className={s.title}>
              <Link
                key={post.slug}
                href="/product-updates/a/[slug]"
                as={`/product-updates/a/${post.slug}`}
              >
                <a>{post.title}</a>
              </Link>
            </h6>
            <div className={s.categories}>
              {post.categories.map(cat => (
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

        {prevPage && (
          <Link
            href={
              prevPage === '/product-updates'
                ? prevPage
                : '/product-updates/p/[page]'
            }
            as={prevPage !== '/product-updates' && prevPage}
          >
            <a>Read more recent posts..</a>
          </Link>
        )}
        {nextPage && (
          <Link href="/product-updates/p/[page]" as={nextPage}>
            <a>Read older posts..</a>
          </Link>
        )}
      </Wrapper>
    </Layout>
  );
}
