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
import { STORIES_PER_PAGE } from 'lib/pages';
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
      meta: _allCustomerStoriesMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(
      1,
      Math.min(5, Math.ceil(meta.count / Number.parseFloat(STORIES_PER_PAGE))),
    ),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($first: IntType!, $skip: IntType!) {
      customerStoriesIndex {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }

      posts: allCustomerStories(
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
        person {
          name
          title
          company
          avatar {
            responsiveImage(
              imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }
            ) {
              ...imageFields
            }
          }
        }
      }

      meta: _allCustomerStoriesMeta {
        count
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['customerStoriesIndex', 'posts'],
    paramsToVars: ({ page }) => ({
      first: STORIES_PER_PAGE,
      skip: STORIES_PER_PAGE * Number.parseInt(page),
    }),
  },
);

export default function CustomerStories({ preview, subscription }) {
  const router = useRouter();

  const {
    data: { posts, customerStoriesIndex, meta },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(customerStoriesIndex.seo)}</Head>
      <Hero
        title={
          <>
            <Highlight>Customer Stories</Highlight>
          </>
        }
        subtitle={
          <>
            Conversations with customers working on some really cool use cases
            with DatoCMS
          </>
        }
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
          {posts.map((post) => (
            <Link key={post.slug} href={`/customer-stories/${post.slug}`}>
              <a className={s.post}>
                {post.coverImage?.responsiveImage && (
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
                  {post.person?.avatar && (
                    <div className={s.person}>
                      <DatoImage
                        className={s.avatar}
                        data={post.person.avatar.responsiveImage}
                      />
                      <div>
                        With {post.person.name} from {post.person.company}
                      </div>
                    </div>
                  )}
                </div>
              </a>
            </Link>
          ))}
        </Masonry>

        <Paginator
          perPage={STORIES_PER_PAGE}
          currentPage={router.query ? Number.parseInt(router.query.page) : 0}
          totalEntries={meta.count}
          href={(index) =>
            index === 0 ? '/customer-stories' : `/customer-stories/p/${index}`
          }
        />
      </Wrapper>
    </Layout>
  );
}
