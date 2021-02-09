import * as React from 'react';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import Link from 'next/link';
import Head from 'next/head';
import s from './style.module.css';
import { renderMetaTags } from 'react-datocms';
import { buildStructuredTextDocumentSchema } from 'utils/fetchCma';
import { JsonSchema } from 'components/Cma/Schema';
import { parse } from 'flatted';

export const getStaticProps = async function ({ params, preview }) {
  const props = await gqlStaticProps(
    `
    query {
      page: docsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          slug
          pages {
            slugOverride
            page {
              slug
            }
          }
          children {
            name
            slug
            pages {
              slugOverride
              page {
                slug
              }
            }
          }
        }
      }
    }
    ${seoMetaTagsFields}
  `,
  )({ params, preview });

  const cma = await buildStructuredTextDocumentSchema();
  props.props.cma = cma;
  return props;
};

const normalize = (slug) => (slug === 'index' ? '' : `/${slug}`);

const Sidebar = ({ roots }) => (
  <>
    {roots.map((root) => (
      <div className={s.group} key={root.slug}>
        <div className={s.groupName}>{root.name}</div>
        <div className={s.guides}>
          {root.children.map((sub, index) => (
            <Link
              href={`/docs/${sub.slug}${normalize(
                sub.pages[0].slugOverride || sub.pages[0].page.slug,
              )}`}
              key={sub.slug}
            >
              <a className={s.guide}>{sub.name}</a>
            </Link>
          ))}
        </div>
      </div>
    ))}
    <div className={s.group}>
      <div className={s.groupName}>Community</div>
      <div className={s.guides}>
        <Link href="/docs/community-tutorials">
          <a className={s.guide}>Community tutorials</a>
        </Link>
      </div>
    </div>
  </>
);

export default function Docs({ roots, preview, page, cma }) {
  const { schema } = React.useMemo(() => cma && parse(cma), [cma]);
  const definitions = Object.keys(schema.definitions)
    .filter((d) => !d.endsWith('Type') && !d.endsWith('Node'))
    .sort((a, b) => {
      return a === 'Document' ? -1 : 1;
    });

  return (
    <DocsLayout preview={preview} sidebar={<Sidebar roots={roots} />}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <div className={s.container}>
        <h2 className={s.title}>Structured Text Dast Format</h2>
        <p className={s.subtitle}>
          Whether you’re a startup or a global enterprise, learn how to
          integrate with DatoCMS to manage your content in a centralized,
          structured hub.
        </p>

        {definitions.map((definitionName) => {
          const definition = schema.definitions[definitionName];
          return (
            <JsonSchema name={definitionName} schema={definition} level={1} />
          );
        })}
      </div>
    </DocsLayout>
  );
}
