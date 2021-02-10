import DocsLayout from 'components/DocsLayout';
import { Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted';
import { request } from 'lib/datocms';
import { useMemo } from 'react';
import Head from 'next/head';
import React from 'react';
import HttpExample from 'components/Cma/HttpExample';
import JsExample from 'components/Cma/JsExample';
import RubyExample from 'components/Cma/RubyExample';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { HrefSchema, Schema } from 'components/Cma/Schema';
import TargetSchema from 'components/Cma/TargetSchema';
import { LanguageConsumer } from 'components/LanguagePicker';
import { useRouter } from 'next/router';
import Prism from 'components/Prism';
import gfm from 'remark-gfm';
import AppError from 'errors/AppError';

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

export const getStaticProps = async function ({
  params: { resource, endpoint },
  preview,
}) {
  const {
    data: { docGroup },
  } = await request({
    query: `
      query($groupSlug: String!) {
        docGroup(filter: { slug: { eq: $groupSlug } }) {
          name
          slug
          pages {
            titleOverride
            slugOverride
            page {
              id
              title
              slug
            }
          }
        }
      }
    `,
    variables: { groupSlug: 'content-management-api' },
    preview,
  });

  const cma = await fetchCma(resource);
  const link = parse(cma).schema.links.find((link) => link.rel === endpoint);

  if (!link) {
    throw new AppError(404);
  }

  return {
    props: {
      docGroup,
      preview: preview ? true : false,
      cma,
      endpoint,
    },
  };
};

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

export default function DocPage({ docGroup, cma, preview, endpoint }) {
  const router = useRouter();
  const result = useMemo(() => cma && parse(cma), [cma]);
  const link =
    result && result.schema.links.find((link) => link.rel === endpoint);

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
                  <ReactMarkdownWithHtml
                    allowDangerousHtml
                    plugins={[gfm]}
                    source={link.description}
                    renderers={{
                      code: ({ language, value }) => {
                        return (
                          <Prism
                            code={value}
                            language={language || 'unknown'}
                            showLineNumbers
                          />
                        );
                      },
                    }}
                  />
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
