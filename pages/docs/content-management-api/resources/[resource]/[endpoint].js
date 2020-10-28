import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted';

import { useMemo } from 'react';
import Head from 'next/head';
import React from 'react';
import HttpExample from 'components/Cma/HttpExample';
import JsExample from 'components/Cma/JsExample';
import RubyExample from 'components/Cma/RubyExample';
import ReactMarkdown from 'react-markdown';
import { HrefSchema, Schema } from 'components/Cma/Schema';
import TargetSchema from 'components/Cma/TargetSchema';
import { LanguageConsumer } from 'components/LanguagePicker';
import { useRouter } from 'next/router';

export const getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return {
    fallback: 'blocking',
    paths: toc
      .map(({ children }) => children)
      .flat(1)
      .map(({ slug, children }) =>
        children
          .map((child) => ({
            params: { resource: slug, endpoint: child.slug },
          }))
          // .slice() only pre-renders the first 2 sub-pages for each section
          // remove it if you want to pre-render all the pages
          .slice(0, 2),
      )
      .flat(),
  };
};

export const getStaticProps = async ({
  params: { resource, endpoint },
  ...other
}) => {
  const { props } = await docPageGetStaticProps({
    ...other,
    params: { chunks: ['content-management-api', ''] },
  });

  const cma = await fetchCma(resource);

  return { props: { ...props, cma, endpoint } };
};

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

export default function DocPage({ docGroup, cma, preview, endpoint }) {
  const router = useRouter();
  const result = useMemo(() => cma && parse(cma), [cma]);
  const link =
    result && result.schema.links.find((link) => link.rel === endpoint);
  const path = link && link.href.replace(regexp, ':$1_id');

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
              result.toc.map((entry) => {
                return {
                  ...entry,
                  children: entry.children.map((resourceEntry) => {
                    return {
                      ...resourceEntry,
                      children:
                        router.query.resource === resourceEntry.slug
                          ? resourceEntry.children
                          : [],
                    };
                  }),
                };
              }),
            )}
          />
        )
      }
    >
      {result && (
        <>
          <Head>
            <title>
              {link.title} - {result.schema.title} - Content Management API
            </title>
          </Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{link.title}</div>
              <div className={s.body}>
                {link.description && (
                  <ReactMarkdown source={link.description} />
                )}
                {link.hrefSchema && <HrefSchema schema={link.hrefSchema} />}
                {link.schema && (
                  <Schema
                    title="Parameters"
                    schema={link.schema.properties.data}
                    showId={link.method !== 'PUT'}
                  />
                )}
                {link && <TargetSchema link={link} />}

                <h4>Examples</h4>
                <LanguageConsumer>
                  {(language) => (
                    <>
                      {language === 'http' && (
                        <HttpExample
                          resource={result.schema}
                          link={link}
                          jobRetrieveLink={result.jobRetrieveLink}
                        />
                      )}

                      {language === 'javascript' && (
                        <JsExample resource={result.schema} link={link} />
                      )}

                      {language === 'ruby' && (
                        <RubyExample resource={result.schema} link={link} />
                      )}
                    </>
                  )}
                </LanguageConsumer>
              </div>
            </div>
          </div>
        </>
      )}
    </DocsLayout>
  );
}
