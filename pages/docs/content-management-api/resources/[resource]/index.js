import DocsLayout from 'components/DocsLayout';
import { Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted';
import { request } from 'lib/datocms';
import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Schema } from 'components/Cma/Schema';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import AppError from 'errors/AppError';

export const getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return {
    fallback: 'blocking',
    paths: toc
      .map(({ children }) => children)
      .flat(1)
      .map(({ slug }) => ({ params: { resource: slug } })),
  };
};

export const getStaticProps = async function ({
  params: { resource },
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

  if (!cma) {
    throw new AppError(404);
  }

  return {
    props: {
      docGroup,
      preview: preview ? true : false,
      cma,
      resourceId: resource,
    },
  };
};

export default function DocPage({ docGroup, cma, preview, resourceId }) {
  const router = useRouter();
  const result = useMemo(() => cma && parse(cma), [cma]);
  const url = `/docs/content-management-api/resources/${resourceId}`;

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
            <title>{result.schema.title} - Content Management API</title>
          </Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{result.schema.title}</div>
              <div className={s.body}>
                <ReactMarkdown source={result.schema.description} />
                <Schema
                  title="Object payload"
                  showId
                  hideRequiredOptional
                  schema={result.schema}
                />

                {result.schema.links.length > 0 && (
                  <>
                    <h4>Available endpoints</h4>
                    <ul>
                      {result.schema.links.map((link) => (
                        <li key={link.rel}>
                          <Link href={`${url}/${link.rel}`}>
                            <a>{link.title}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DocsLayout>
  );
}
