import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { gqlStaticPaths, gqlStaticProps, imageFields } from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
import FormattedDate from 'components/FormattedDate';

import { range } from 'range';
import gql from 'graphql-tag';

import s from './style.css';

const POSTS_PER_PAGE = 16;

export const unstable_getStaticPaths = gqlStaticPaths(
  gql`
    query {
      meta: _allBlogPostsMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) => range(1, Math.ceil(meta.count / parseFloat(POSTS_PER_PAGE))),
);

export const unstable_getStaticProps = gqlStaticProps(
  gql`
    query($first: IntType!, $skip: IntType!) {
      posts: allBlogPosts(
        first: $first
        skip: $skip
        orderBy: _firstPublishedAt_DESC
      ) {
        slug
        title
        excerpt(markdown: true)
        coverImage {
          responsiveImage(imgixParams: { w: 550 }) {
            ...imageFields
          }
        }
        _firstPublishedAt
      }

      meta: _allBlogPostsMeta {
        count
      }
    }

    ${imageFields}
  `,
  ({ page }) => ({
    first: POSTS_PER_PAGE,
    skip: POSTS_PER_PAGE * parseInt(page),
  }),
  ({ posts, meta }, { params: { page } }) => ({
    posts,
    prevPage:
      parseInt(page) > 1
        ? `/blog/p/${parseInt(page) - 1}`
        : parseInt(page) === 1
        ? `/blog`
        : null,
    nextPage:
      (parseInt(page) + 1) * POSTS_PER_PAGE < meta.count
        ? `/blog/p/${parseInt(page) + 1}`
        : null,
  }),
);

export default function Blog({ posts, prevPage, nextPage }) {
  return (
    <Layout>
      <Hero
        title={
          <>
            Welcome to the <Highlight>DatoCMS&nbsp;Blog</Highlight>
          </>
        }
        subtitle={<>News, tips and highlights from the team at DatoCMS</>}
      />
      <Wrapper>
        <Masonry
          breakpointCols={2}
          className={s.grid}
          columnClassName={s.column}
        >
          {posts.map(post => (
            <Link
              key={post.slug}
              href="/blog/a/[slug]"
              as={`/blog/a/${post.slug}`}
            >
              <a className={s.post}>
                {post.coverImage && (
                  <Image data={post.coverImage.responsiveImage} />
                )}
                <div className={s.postBody}>
                  <h6 className={s.title}>{post.title}</h6>
                  <div
                    className={s.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                  <div className={s.footer}>
                    <div className={s.date}>
                      Posted on <FormattedDate date={post._firstPublishedAt} />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </Masonry>
        {prevPage && (
          <Link
            href={prevPage === '/blog' ? prevPage : '/blog/p/[page]'}
            as={prevPage !== '/blog' && prevPage}
          >
            <a>Read more recent posts..</a>
          </Link>
        )}
        {nextPage && (
          <Link href="/blog/p/[page]" as={nextPage}>
            <a>Read older posts..</a>
          </Link>
        )}
      </Wrapper>
    </Layout>
  );
}
