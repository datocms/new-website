import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
import FormattedDate from 'components/FormattedDate';
import { BLOG_POSTS_PER_PAGE } from 'lib/sitemap';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import Paginator from 'components/Paginator';
import { range } from 'range';
import { useRouter } from 'next/router';
import s from './style.module.css';
import { useQuerySubscription } from 'react-datocms';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allBlogPostsMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(
      1,
      Math.min(5, Math.ceil(meta.count / parseFloat(BLOG_POSTS_PER_PAGE))),
    ),
);

const query = `
  query($first: IntType!, $skip: IntType!) {
    blog {
      seo: _seoMetaTags {
        ...seoMetaTagsFields
      }
    }
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
  ${seoMetaTagsFields}
`;

export const getStaticProps = gqlStaticProps(
  query,
  ({ page }) => ({
    first: BLOG_POSTS_PER_PAGE,
    skip: BLOG_POSTS_PER_PAGE * parseInt(page),
  }),
  (data) => ({
    ...data,
    perPage: BLOG_POSTS_PER_PAGE,
  }),
);

export default function Blog({ preview, subscription, perPage }) {
  const router = useRouter();

  const {
    data: { posts, blog, meta },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      {!router.isFallback && <Head>{renderMetaTags(blog.seo)}</Head>}
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
          breakpointCols={{
            default: 2,
            650: 1,
          }}
          className={s.grid}
          columnClassName={s.column}
        >
          {posts &&
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <a className={s.post}>
                  {post.coverImage && (
                    <Image
                      className={s.image}
                      data={post.coverImage.responsiveImage}
                    />
                  )}
                  <div className={s.postBody}>
                    <h6 className={s.title}>{post.title}</h6>
                    <div
                      className={s.excerpt}
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <div className={s.footer}>
                      <div className={s.date}>
                        Posted on{' '}
                        <FormattedDate date={post._firstPublishedAt} />
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </Masonry>
        {!router.isFallback && meta && (
          <Paginator
            perPage={perPage}
            currentPage={router.query ? parseInt(router.query.page) : 0}
            totalEntries={meta.count}
            href={(index) => (index === 0 ? '/blog' : `/blog/p/${index}`)}
          />
        )}
      </Wrapper>
    </Layout>
  );
}
