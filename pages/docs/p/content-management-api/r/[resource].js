import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  Toc,
  unstable_getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/p/[...chunks]';
import s from 'pages/docs/pageStyle.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted/cjs';
import { useMemo } from 'react';
import Head from 'next/head';
import CmaResourceAttributes from 'components/CmaResourceAttributes';
import CmaResourceMethod from 'components/CmaResourceMethod';

export const unstable_getStaticProps = async ({ params: { resource } }) => {
  const { props } = await docPageUnstableGetStaticProps({
    params: { chunks: ['content-management-api', 'overview'] },
  });

  const cma = await fetchCma(resource);

  return { props: { ...props, cma } };
};

export default function DocPage({ docGroup, titleOverride, page, cma }) {
  const { toc, schema } = useMemo(() => parse(cma), [cma]);

  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title={docGroup.name}
          entries={[].concat(
            docGroup.pages.map(page => {
              return {
                url: `/docs/p/${docGroup.slug}${
                  page.page.slug === 'index' ? '' : `/${page.page.slug}`
                }`,
                label: page.titleOverride || page.page.title,
              };
            }),
            toc,
          )}
        />
      }
    >
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>{schema.title}</div>
          {schema.description}
          <CmaResourceAttributes resource={schema} />
          {schema.links.map(link => (
            <CmaResourceMethod key={link.title} resource={schema} link={link} />
          ))}
        </div>
        <Toc
          extraEntries={[
            {
              anchor: 'object-fields',
              label: 'Attributes',
            },
          ].concat(
            schema.links.map(link => ({
              anchor: link.rel,
              label: link.title,
            })),
          )}
        />
      </div>
    </DocsLayout>
  );
}

// const resources = cmaResources.map((resource, i) => {
//   slugs.reset();
//   const headings = [
//     {
//       id: '#object',
//       title: 'Object fields',
//     },
//   ].concat(

//   );

//   return {
//     chapter,
//     path: `/docs/content-management-api/resources/${resource.id.replace(
//       /_/g,
//       '-',
//     )}`,
//     title: resource.title,
//     headings,
//     template: 'CmaApiResourcePage',
//     context: { resource: stringify(resource) },
//   };
// });

// TOC
// [
//   {
//     id: '#object',
//     title: 'Object fields',
//   },
// ].concat(
//   resource.links.map(link => ({
//     id: `#${link.rel}`,
//     title: link.title,
//   })),
// )
