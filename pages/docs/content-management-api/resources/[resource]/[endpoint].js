import DocsLayout from 'components/DocsLayout';
import { Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import fetchCmaClientResources from 'utils/fetchCmaClientResources';
import { parse } from 'flatted';
import { request } from 'lib/datocms';
import { useMemo } from 'react';
import Head from 'components/Head';
import React from 'react';
import HttpExample from 'components/Cma/HttpExample';
import OldJsExample from 'components/Cma/OldJsExample';
import JsExample from 'components/Cma/JsExample';
import DocDescription from 'components/DocDescription';
import { HrefSchema, Schema } from 'components/Cma/Schema';
import TargetSchema from 'components/Cma/TargetSchema';
import { LanguageConsumer } from 'components/LanguagePicker';
import { useRouter } from 'next/router';
import { handleErrors } from 'lib/datocms';

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

export const getStaticProps = handleErrors(async function ({
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
            __typename
            ... on DocGroupPageRecord {
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
      }
    `,
    variables: { groupSlug: 'content-management-api' },
    preview,
  });

  if (!docGroup) {
    return { notFound: true };
  }

  const [cma, clientInfo] = await Promise.all([
    fetchCma(resource, endpoint),
    fetchCmaClientResources(resource, endpoint),
  ]);

  if (!cma || !clientInfo) {
    return { notFound: true };
  }

  return {
    props: {
      docGroup,
      preview: preview ? true : false,
      cma,
      endpoint,
      resource,
      clientInfo,
    },
  };
});

export default function DocPage({
  docGroup,
  cma,
  preview,
  endpoint,
  resource,
  clientInfo,
}) {
  const router = useRouter();
  const result = useMemo(() => parse(cma), [cma]);
  const link = result.schema.links.find((link) => link.rel === endpoint);

  return (
    <DocsLayout
      languageSwitch
      preview={preview}
      sidebar={
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
      }
    >
      <Head canonicalUrl={`/docs/${docGroup.slug}/resources/${resource}`}>
        <title>
          {link.title} - {result.schema.title} - Content Management API
        </title>
      </Head>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>{link.title}</div>
          <div className={s.body}>
            {link.description && (
              <DocDescription>{link.description}</DocDescription>
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

            <h2>Examples</h2>
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
                    <JsExample
                      resource={result.schema}
                      link={link}
                      clientInfo={clientInfo}
                    />
                  )}

                  {language === 'old-js' && (
                    <OldJsExample resource={result.schema} link={link} />
                  )}
                </>
              )}
            </LanguageConsumer>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
