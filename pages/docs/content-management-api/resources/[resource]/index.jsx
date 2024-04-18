import { Definition } from 'components/Cma/Schema';
import DocDescription from 'components/DocDescription';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import { parse } from 'flatted';
import { request } from 'lib/datocms';
import { handleErrors } from 'lib/datocms';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import { useMemo } from 'react';
import fetchCma from 'utils/fetchCma';

export const getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return {
    fallback: 'blocking',
    paths: toc
      .flatMap(({ children }) => children)
      .map(({ slug }) => ({ params: { resource: slug } })),
  };
};

export const getStaticProps = handleErrors(
  async ({ params: { resource }, preview }) => {
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

    const cma = await fetchCma(resource);

    if (!cma) {
      return { notFound: true };
    }

    return {
      props: {
        docGroup,
        preview: preview ? true : false,
        cma,
        resourceId: resource,
      },
    };
  },
);

export default function DocPage({ docGroup, cma, preview, resourceId }) {
  const router = useRouter();
  const result = useMemo(() => parse(cma), [cma]);
  const url = `/docs/content-management-api/resources/${resourceId}`;
  const links = result.schema.links.filter((link) => !link.private);

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
      <Head>
        <title>{result.schema.title} - Content Management API - DatoCMS</title>
      </Head>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>{result.schema.title}</div>
          <div className={s.body}>
            <DocDescription>{result.schema.description}</DocDescription>
            <Definition title="Object payload" showId schema={result.schema} />

            {links && (
              <>
                <h4>Available endpoints</h4>
                <ul>
                  {links.map((link) => (
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
    </DocsLayout>
  );
}
