import FormattedDate from 'components/FormattedDate';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Paginator from 'components/Paginator';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { BLOG_POSTS_PER_PAGE } from 'lib/pages';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { range } from 'range';
import {
  Image as DatoImage,
  StructuredText,
  renderMetaTags,
} from 'react-datocms';
import Masonry from 'react-masonry-css';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

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

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($first: IntType!, $skip: IntType!) {
      blog {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }

      posts: allBlogPosts(
        first: $first
        skip: $skip
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        slug
        title
        excerpt {
          value
        }
        coverImage {
          url(imgixParams: { auto: format, w: 550 })
          author
          customData
          responsiveImage(imgixParams: { auto: format, w: 550 }) {
            ...imageFields
          }
        }
        _firstPublishedAt
        _createdAt
      }

      meta: _allBlogPostsMeta {
        count
      }

      latestChangelogEntry: changelogEntry(
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC],
        filter: {showInBlog: {eq: true}}
      ) {
        title
        slug
        _firstPublishedAt
        _createdAt
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
    requiredKeys: ['blog', 'posts'],
    paramsToVars: ({ page }) => ({
      first: BLOG_POSTS_PER_PAGE,
      skip: BLOG_POSTS_PER_PAGE * parseInt(page),
    }),
  },
);

export default function Blog({ preview, subscription }) {
  const router = useRouter();

  const {
    data: { posts, blog, meta, latestChangelogEntry },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(blog.seo)}</Head>
      <Hero
        title={
          <>
            Welcome to the <Highlight>DatoCMS&nbsp;Blog</Highlight>
          </>
        }
        subtitle={<>News, tips and highlights from the team at DatoCMS</>}
      />
      <Wrapper>
        {latestChangelogEntry && (
          <div>
            <div className={s.changelogIntro}>
              Latest from our Product Updates changelog →
            </div>
            <Link href={`/product-updates`}>
              <a className={s.changelogEntry}>
                <div className={s.changelogEntryTitle}>
                  {latestChangelogEntry.title}
                </div>
                <div className={s.changelogEntryDate}>
                  <FormattedDate
                    date={
                      latestChangelogEntry._firstPublishedAt ||
                      latestChangelogEntry._createdAt
                    }
                  />
                </div>
              </a>
            </Link>
          </div>
        )}

        <Masonry
          breakpointCols={{
            default: 2,
            650: 1,
          }}
          className={s.grid}
          columnClassName={s.column}
        >
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <a className={s.post}>
                {post.coverImage && post.coverImage.responsiveImage && (
                  <div className={s.coverImage}>
                    <DatoImage
                      className={s.image}
                      data={post.coverImage.responsiveImage}
                    />
                    {post.coverImage.author &&
                      post.coverImage.customData.unsplash_author_username && (
                        <a
                          className={s.coverImageAttribution}
                          href={`https://unsplash.com/@${post.coverImage.customData.unsplash_author_username}?utm_source=datocms&utm_medium=referral`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Photo by {post.coverImage.author}
                        </a>
                      )}
                  </div>
                )}
                {post.coverImage && !post.coverImage.responsiveImage && (
                  <img className={s.image} src={post.coverImage.url} />
                )}
                <div className={s.postBody}>
                  <h6 className={s.title}>{post.title}</h6>
                  <div className={s.excerpt}>
                    <StructuredText data={post.excerpt} />
                  </div>
                  <div className={s.footer}>
                    <div className={s.date}>
                      Posted on{' '}
                      <FormattedDate
                        date={post._firstPublishedAt || post._createdAt}
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </Masonry>

        <Paginator
          perPage={BLOG_POSTS_PER_PAGE}
          currentPage={router.query ? parseInt(router.query.page) : 0}
          totalEntries={meta.count}
          href={(index) => (index === 0 ? '/blog' : `/blog/p/${index}`)}
        />
      </Wrapper>
    </Layout>
  );
}
