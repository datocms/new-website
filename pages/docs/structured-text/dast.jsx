import { JsonSchemaObject } from 'components/Cma/Schema';
import DocPageContent from 'components/DocPageContent';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import Heading from 'components/Heading';
import Prism from 'components/Prism';
import { parse } from 'flatted';
import { handleErrors } from 'lib/datocms';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import { useMemo } from 'react';
import { renderMetaTags } from 'react-datocms';
import ReactMarkdown from 'react-markdown';
import { buildStructuredTextDocumentSchema } from 'utils/fetchStructuredText';
import { useQuerySubscription } from 'utils/useQuerySubscription';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const { props } = await docPageGetStaticProps({
    params: { chunks: ['structured-text', 'dast'] },
    preview,
  });

  if (!props) {
    return { notFound: true };
  }

  const schema = await buildStructuredTextDocumentSchema();

  return { props: { ...props, schema } };
});

function intersperse(arr, sep, endSep = sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    (xs, x, i) => {
      return xs.concat([i === arr.length - 2 ? endSep : sep, x]);
    },
    [arr[0]],
  );
}

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

export default function DocPage({ docGroup, pageSubscription, schema }) {
  const result = useMemo(() => schema && parse(schema), [schema]);
  const definitions = findAllChildrenDefinitions(result.definitions.Root);
  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;

  // this is to prevent the build from breaking while the structured text doc group is not published
  if (!docGroup) {
    return null;
  }

  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title={docGroup.name}
          entries={docGroup.pages.map((page) => {
            return {
              url: `/docs/${docGroup.slug}${
                page.page.slug === 'index' ? '' : `/${page.page.slug}`
              }`,
              label: page.page.title,
            };
          })}
        />
      }
    >
      <Head>{renderMetaTags(page._seoMetaTags)}</Head>
      <div className={s.articleContainer}>
        <Toc
          content={page.content}
          extraEntries={[
            ...definitions.map((definition) => {
              const name = definition.properties.type.const;

              return {
                anchor: name,
                label: (
                  <>
                    Node <code>{name}</code>
                  </>
                ),
                tag: 'h4',
              };
            }),
          ]}
        />
        <div className={s.article}>
          <div className={s.title}>{page.title}</div>
          <DocPageContent content={page.content} style={s}>
            <Heading anchor="nodes" as="h3">
              Nodes
            </Heading>
            {definitions.map((definition) => {
              const name = definition.properties.type.const;
              const match = definition.description.match(
                /```([a-z]+)\n((.*\n)+)```/,
              );
              const exampleCode = match && {
                code: match[2].trim(),
                language: match[1],
              };
              return (
                <div key={name}>
                  <Heading anchor={name} as="h4">
                    <code>{name}</code>
                  </Heading>
                  <ReactMarkdown
                    components={{
                      // eslint-disable-next-line react/display-name
                      pre: ({ children }) => <>{children}</>,
                      // eslint-disable-next-line react/display-name
                      code: ({ inline, children }) =>
                        inline ? <code>{children}</code> : null,
                    }}
                  >
                    {definition.description}
                  </ReactMarkdown>
                  {definition.properties.children ? (
                    <p>
                      It allows the following children nodes :{' '}
                      <>
                        {intersperse(
                          (
                            definition.properties.children.items.anyOf || [
                              definition.properties.children.items,
                            ]
                          ).map((sub) => (
                            <a
                              key={sub.properties.type.const}
                              href={`#${sub.properties.type.const}`}
                            >
                              <code>{sub.properties.type.const}</code>
                            </a>
                          )),
                          ', ',
                          ' and ',
                        )}
                        .
                      </>
                    </p>
                  ) : (
                    <p>It does not allow children nodes.</p>
                  )}
                  <JsonSchemaObject
                    key={name}
                    name={name}
                    schema={definition}
                    level={1}
                  />
                  {exampleCode && <Prism {...exampleCode} />}
                </div>
              );
            })}
          </DocPageContent>
        </div>
      </div>
    </DocsLayout>
  );
}
