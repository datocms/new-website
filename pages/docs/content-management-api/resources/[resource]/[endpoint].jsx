import HttpExamples, { HttpExample } from 'components/Cma/HttpExamples';
import JSExamples, { JSExample } from 'components/Cma/JsExamples';
import { HrefSchema, Schema } from 'components/Cma/Schema';
import TargetSchema from 'components/Cma/TargetSchema';
import DocDescription from 'components/DocDescription';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import { LanguageConsumer } from 'components/LanguagePicker';
import { parse } from 'flatted';
import { handleErrors, request } from 'lib/datocms';
import { useRouter } from 'next/router';
import { Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import React, { useMemo } from 'react';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import unified from 'unified';
import visit from 'unist-util-visit';
import fetchCma from 'utils/fetchCma';
import fetchCmaClientResources from 'utils/fetchCmaClientResources';
import { docPageOgImageUrl } from 'utils/tweakSeoMetaTags';

export const getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return {
    fallback: 'blocking',
    paths: toc
      .flatMap(({ children }) => children)
      .flatMap(({ slug, children }) =>
        children
          .map((child) => ({
            params: { resource: slug, endpoint: child.slug },
          }))
          // .slice() only pre-renders the first 2 sub-pages for each section
          // remove it if you want to pre-render all the pages
          .slice(0, 2),
      ),
  };
};

export const getStaticProps = handleErrors(
  async ({ params: { resource, endpoint }, preview }) => {
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
  },
);

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

  const ogImageUrl = docPageOgImageUrl(
    result.schema.title,
    'Content Management API',
  );

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
        <title key="title">
          {link.title} — {result.schema.title} — Content Management API
        </title>
        <meta key="meta-og:image" property="og:image" content={ogImageUrl} />
        <meta
          key="meta-twitter:image"
          name="twitter:image"
          content={ogImageUrl}
        />
      </Head>
      <LanguageConsumer>
        {(language) => {
          const description =
            link.documentation?.[language]?.description || link.description;

          const examples = link?.documentation?.[language]?.examples || [];
          const allExampleIds = examples.map((e) => e.id);

          const referencedExampleIds = [];

          visit(
            unified().use(remarkParse).use(remarkDirective).parse(description),
            (node) => {
              if (node.type === 'leafDirective') {
                if (node.name === 'example') {
                  referencedExampleIds.push(node.children[0].value);
                }
              }
            },
          );

          return (
            <div className={s.articleContainer}>
              <div className={s.article}>
                <div className={s.title}>{link.title}</div>
                <div className={s.body}>
                  {description && (
                    <DocDescription
                      renderExample={(exampleId, singleExample) => {
                        const example = examples.find(
                          (e) => e.id === exampleId,
                        );

                        if (!example) {
                          return null;
                        }

                        if (language === 'http') {
                          return (
                            <HttpExample
                              example={example}
                              link={link}
                              startExpanded={singleExample}
                            />
                          );
                        }

                        return (
                          <JSExample
                            example={example}
                            schema={result.schema}
                            link={link}
                            clientInfo={clientInfo}
                            startExpanded={singleExample}
                          />
                        );
                      }}
                    >
                      {description}
                    </DocDescription>
                  )}
                  {link.hrefSchema && (
                    <HrefSchema schema={link.hrefSchema} language={language} />
                  )}
                  {link.schema && (
                    <Schema
                      title="Body Parameters"
                      schema={link.schema.properties.data}
                      optional={
                        Array.isArray(link.schema.type) &&
                        link.schema.type.includes('null')
                      }
                      showId={link.method !== 'PUT'}
                    />
                  )}

                  {link && <TargetSchema link={link} />}

                  {(allExampleIds.length === 0 ||
                    allExampleIds.length > referencedExampleIds.length) && (
                    <>
                      <h2>
                        {referencedExampleIds.length > 0 &&
                        allExampleIds.length > referencedExampleIds.length ? (
                          <>Other examples</>
                        ) : (
                          <>Examples</>
                        )}
                      </h2>

                      {language === 'http' && (
                        <HttpExamples
                          link={link}
                          jobRetrieveLink={result.jobRetrieveLink}
                          omitExampleIds={referencedExampleIds}
                        />
                      )}

                      {language === 'javascript' && (
                        <JSExamples
                          schema={result.schema}
                          link={link}
                          clientInfo={clientInfo}
                          omitExampleIds={referencedExampleIds}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </LanguageConsumer>
    </DocsLayout>
  );
}
