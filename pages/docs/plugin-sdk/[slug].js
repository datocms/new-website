import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import s from 'pages/docs/pageStyle.module.css';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import { fetchSdkPages } from 'utils/fetchPluginSdk';
import { handleErrors } from 'lib/datocms';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import { gqlStaticPaths } from 'lib/datocms';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      root: docGroup(filter: { slug: { eq: "plugin-sdk" } }) {
        pages {
          page {
            slug
          }
        }
      }
    }
  `,
  'slug',
  ({ root }) => (root ? root.pages.map((p) => p.page.slug) : []),
);

export const getStaticProps = handleErrors(
  async ({ params: { slug }, ...other }) => {
    const { props } = await docPageGetStaticProps({
      ...other,
      params: { chunks: ['plugin-sdk', slug] },
    });

    const sdkPages = await fetchSdkPages();

    return { props: { ...props, sdkPages } };
  },
);

export default function DocPage({
  docGroup,
  titleOverride,
  page,
  sdkPages,
  preview,
}) {
  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            entries={[
              ...docGroup.pages.map((page) => {
                return {
                  url: `/docs/${docGroup.slug}${
                    page.page.slug === 'index' ? '' : `/${page.page.slug}`
                  }`,
                  label: page.titleOverride || page.page.title,
                };
              }),
              {
                label: 'SDK Reference',
                children: sdkPages.map((page) => {
                  return {
                    url: `/docs/plugin-sdk/sdk/${page.slug}`,
                    label: page.title,
                  };
                }),
              },
            ]}
          />
        )
      }
    >
      <Head>{renderMetaTags(page._seoMetaTags)}</Head>
      <div className={s.articleContainer}>
        <Toc content={page.content} />
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <PostContent content={page.content} style={s} />
        </div>
      </div>
    </DocsLayout>
  );
}
