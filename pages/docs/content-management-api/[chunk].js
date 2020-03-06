import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted/cjs';
import { useMemo } from 'react';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import PostContent from 'components/PostContent';
import { gqlStaticPaths } from 'lib/datocms';
import gql from 'graphql-tag';

export const getStaticPaths = gqlStaticPaths(
  gql`
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
  ({ root }) => root.pages.map(p => p.page.slug),
);

export const getStaticProps = async ({ params: { chunk }, ...other }) => {
  const { props } = await docPageUnstableGetStaticProps({
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
              docGroup.pages.map(page => {
                return {
                  url: `/docs/${docGroup.slug}${
                    page.page.slug === 'index' ? '' : `/${page.page.slug}`
                  }`,
                  label: page.titleOverride || page.page.title,
                };
              }),
              result.toc,
            )}
          />
        )
      }
    >
      {page && (
        <>
          <Head>{renderMetaTags(page._seoMetaTags)}</Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{titleOverride || page.title}</div>
              <PostContent content={page.content} style={s} />
            </div>
            <Toc content={page.content} />
          </div>
        </>
      )}
    </DocsLayout>
  );
}
