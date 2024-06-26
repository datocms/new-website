import DocPageContent from 'components/DocPageContent';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import { parse } from 'flatted';
import { gqlStaticPaths } from 'lib/datocms';
import { handleErrors } from 'lib/datocms';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import { useMemo } from 'react';
import { renderMetaTags } from 'react-datocms';
import fetchCma from 'utils/fetchCma';
import { changeImageWithGeneratedDoc } from 'utils/tweakSeoMetaTags';
import { useQuerySubscription } from 'utils/useQuerySubscription';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      root: docGroup(filter: { slug: { eq: "content-management-api" } }) {
        pages {
          ... on DocGroupPageRecord {
            page {
              slug
            }
          }
        }
      }
    }
  `,
  'chunk',
  ({ root }) => root.pages.map((p) => p.page.slug),
);

export const getStaticProps = handleErrors(
  async ({ params: { chunk }, ...other }) => {
    const { props } = await docPageGetStaticProps({
      ...other,
      params: { chunks: ['content-management-api', chunk] },
    });

    if (!props) {
      return { notFound: true };
    }

    const cma = await fetchCma();

    if (!cma) {
      return { notFound: true };
    }

    return { props: { ...props, cma } };
  },
);

export default function DocPage({
  docGroup,
  titleOverride,
  pageSubscription,
  cma,
  preview,
}) {
  const result = useMemo(() => parse(cma), [cma]);

  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;

  return (
    <DocsLayout
      preview={preview}
      sidebar={
        docGroup && (
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
      <Head>
        {renderMetaTags(
          changeImageWithGeneratedDoc(
            page._seoMetaTags,
            titleOverride || page.title,
            'Content Management API',
          ),
        )}
      </Head>
      <div className={s.articleContainer}>
        <Toc content={page.content} />
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <DocPageContent content={page.content} style={s} />
        </div>
      </div>
    </DocsLayout>
  );
}
