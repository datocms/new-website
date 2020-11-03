import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted';

import { useMemo } from 'react';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import PostContent from 'components/PostContent';
import { gqlStaticPaths } from 'lib/datocms';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      root: docGroup(filter: { slug: { eq: "content-management-api" } }) {
        pages {
          page {
            slug
          }
        }
      }
    }
  `,
  'chunk',
  ({ root }) => root.pages.map((p) => p.page.slug),
);

export const getStaticProps = async ({ params: { chunk }, ...other }) => {
  const { props } = await docPageGetStaticProps({
    ...other,
    params: { chunks: ['content-management-api', chunk] },
  });

  const cma = await fetchCma();

  return { props: { ...props, cma } };
};

export default function DocPage(props) {
  const { docGroup, titleOverride, page, cma, preview } = props;
  const result = useMemo(() => cma && parse(cma), [cma]);

  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup &&
        result && (
          <Sidebar
            title={docGroup.name}
            entries={[].concat(
              docGroup.pages.map((page) => {
                return {
                  url: `/docs/${docGroup.slug}${
                    page.page.slug === 'index' ? '' : `/${page.page.slug}`
                  }`,
                  label: page.titleOverride || page.page.title,
                };
              }),
              result.toc.map((entry) => {
                return {
                  ...entry,
                  children: entry.children.map((resourceEntry) => {
                    return {
                      ...resourceEntry,
                      children: [],
                    };
                  }),
                };
              }),
            )}
          />
        )
      }
    >
      {page && (
        <>
          <Head>{renderMetaTags(page._seoMetaTags)}</Head>
          <div className={s.articleContainer}>
            <Toc content={page.content} />
            <div className={s.article}>
              <div className={s.title}>{titleOverride || page.title}</div>
              <PostContent content={page.content} style={s} />
            </div>
          </div>
        </>
      )}
    </DocsLayout>
  );
}
