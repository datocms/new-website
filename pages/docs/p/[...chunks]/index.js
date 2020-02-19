import { initApolloClient, seoMetaTagsFields, imageFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import gql from 'graphql-tag';
import PostContent from 'components/PostContent';
import Link from 'next/link';
import ActiveLink from 'components/ActiveLink';
import s from '../../pageStyle.css';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';

export const unstable_getStaticProps = async function({ params: { chunks } }) {
  const groupSlug = chunks[chunks.length - 2];
  const pageSlug = chunks[chunks.length - 1];
  const apolloClient = initApolloClient();

  const {
    data: { docGroup },
  } = await apolloClient.query({
    query: gql`
      query($groupSlug: String!) {
        docGroup(filter: { slug: { eq: $groupSlug } }) {
          name
          slug
          pages {
            id
            title
            slug
          }
        }
      }
    `,
    variables: { groupSlug },
  });

  const page = docGroup && docGroup.pages.find(page => page.slug === pageSlug);

  const pageId = page && page.id;

  const {
    data: { page: pageData },
  } = await apolloClient.query({
    query: gql`
      query($pageId: ItemId!) {
        page: docPage(filter: { id: { eq: $pageId } }) {
          title
          _seoMetaTags {
            ...seoMetaTagsFields
          }
          content {
            ... on TextRecord {
              id
              _modelApiKey
              text(markdown: true)
            }
            ... on ImageRecord {
              id
              _modelApiKey
              image {
                format
                width
                responsiveImage(imgixParams: { w: 810 }) {
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
              loop
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
            ...on CodeBlockRecord {
              _modelApiKey
              code
              language
            }
          }
        }
      }

      ${seoMetaTagsFields}
      ${imageFields}
    `,
    variables: { pageId },
  });

  return { props: { docGroup, page: pageData } };
};

export default function DocPage({ docGroup, page }) {
  return (
    <DocsLayout
      sidebar={
        <>
          <Link href="/docs">
            <a className={s.backHome}>
              <LeftIcon /> Home
            </a>
          </Link>

          <div className={s.groupName}>{docGroup.name}</div>

          {docGroup.pages.map(page => (
            <ActiveLink
              href="/docs/p/[...chunks]"
              as={`/docs/p/${docGroup.slug}/${page.slug}`}
              activeClassName={s.activePage}
              key={page.slug}
            >
              <a className={s.page}>
                {page.title}
              </a>
            </ActiveLink>
          ))}
        </>
      }
    >
      <div className={s.title}>{page.title}</div>
      <PostContent content={page.content} style={s} />
    </DocsLayout>
  );
}
