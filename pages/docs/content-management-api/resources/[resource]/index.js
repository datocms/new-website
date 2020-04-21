import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import docHref from 'utils/docHref';
import { parse } from 'flatted/cjs';
import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Schema } from 'components/Cma/Schema';
import ReactMarkdown from 'react-markdown';

export const getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return {
    fallback: true,
    paths: toc.map(({ slug }) => ({ params: { resource: slug } })),
  };
};

export const getStaticProps = async ({ params: { resource }, ...other }) => {
  const { props } = await docPageGetStaticProps({
    ...other,
    params: { chunks: ['content-management-api', ''] },
  });

  const cma = await fetchCma(resource);

  return { props: { ...props, cma, resourceId: resource } };
};

export default function DocPage({ docGroup, cma, preview, resourceId }) {
  const result = useMemo(() => cma && parse(cma), [cma]);
  const url = `/docs/content-management-api/resources/${resourceId}/`;

  return (
    <DocsLayout
      languageSwitch
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
              result.toc,
            )}
          />
        )
      }
    >
      {result && (
        <>
          <Head>
            <title>{result.schema.title} - Content Management API</title>
          </Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{result.schema.title}</div>
              <div className={s.body}>
                <ReactMarkdown source={result.schema.description} />
                <Schema title="Object payload" showId schema={result.schema} />

                <h4>Available endpoints</h4>
                <ul>
                  {result.schema.links.map((link) => (
                    <li key={link.rel}>
                      <Link
                        href={docHref(`${url}/${link.rel}`)}
                        as={`${url}/${link.rel}`}
                      >
                        <a>{link.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </DocsLayout>
  );
}
