import * as React from 'react';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import Link from 'next/link';
import Head from 'next/head';
import s from './style.module.css';
import { renderMetaTags } from 'react-datocms';
import { buildStructuredTextDocumentSchema } from 'utils/fetchStructuredText';
import { parse } from 'flatted';
import { Properties } from 'components/Cma/Schema';
import ReactMarkdown from 'react-markdown';

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

  const schema = await buildStructuredTextDocumentSchema();
  props.props.schema = schema;
  return props;
};

const normalize = (slug) => (slug === 'index' ? '' : `/${slug}`);

const Sidebar = ({ roots }) => (
  <>
    {roots.map((root) => (
      <div className={s.group} key={root.name}>
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

const findAllChildrenDefinitions = (definition, foundDefs = []) => {
  if (foundDefs.includes(definition)) {
    return foundDefs;
  }

  const result = [...foundDefs, definition];

  if (!definition.properties.children) {
    return result;
  }

  const children = definition.properties.children.items.anyOf || [
    definition.properties.children.items,
  ];

  return children.reduce(
    (acc, def) => findAllChildrenDefinitions(def, acc),
    result,
  );
};

export default function Docs({ roots, preview, page, schema }) {
  const result = React.useMemo(() => schema && parse(schema), [schema]);
  const definitions = findAllChildrenDefinitions(result.definitions.Root);

  return (
    <DocsLayout preview={preview} sidebar={<Sidebar roots={roots} />}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <div className={s.container}>
        <h2 className={s.title}>Structured Text Dast Format</h2>
        <p className={s.subtitle}>
          This document defines a format for representing Structured Text as a
          Dato Abstract Syntax Tree (Dast).
        </p>

        <h3>Nodes</h3>
        {definitions.map((definition) => {
          const name = definition.properties.type.const;

          return (
            <>
              <h2>
                <code>{name}</code>
              </h2>
              <ReactMarkdown source={definition.description} />
              <Properties
                key={name}
                name={name}
                schema={definition}
                level={1}
              />
            </>
          );
        })}
      </div>
    </DocsLayout>
  );
}
