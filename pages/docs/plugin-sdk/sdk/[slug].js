import DocsLayout from 'components/DocsLayout';
import Prism from 'components/Prism';
import { Toc, Sidebar } from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import Heading from 'components/Heading';
import Head from 'next/head';
import { request } from 'lib/datocms';
import {
  fetchPluginSdkHooks,
  fetchSdkPages,
  fetchSdkPageContent,
} from 'utils/fetchPluginSdk';
import ReactMarkdown from 'react-markdown';
import { handleErrors } from 'lib/datocms';
import s2 from './style.module.css';
import PlusIcon from 'public/icons/regular/plus.svg';
import TimesIcon from 'public/icons/regular/times.svg';
import GithubIcon from 'public/icons/brands/github.svg';
import { useState } from 'react';
import slugify from 'utils/slugify';

const baseUrl =
  'https://github.com/datocms/plugins-sdk/blob/v0.2/packages/sdk/src/types.ts';

const MarkdownHeading = ({ level, children, node }) => {
  return (
    <Heading
      anchor={slugify(node.children[0].value)}
      as={`h${level}`}
      data-with-anchor
    >
      {children}
    </Heading>
  );
};

const Markdown = ({ children }) => (
  <ReactMarkdown
    components={{
      // eslint-disable-next-line react/display-name
      h2: MarkdownHeading,
      h3: MarkdownHeading,
      h4: MarkdownHeading,
      h5: MarkdownHeading,

      // eslint-disable-next-line react/display-name
      pre: ({ children }) => <>{children}</>,
      // eslint-disable-next-line react/display-name
      code: ({ inline, className, children }) => {
        const match = /language-(\w+)/.exec(className || '');
        return inline ? (
          <code>{children}</code>
        ) : (
          <Prism
            code={String(children).replace(/\n$/, '')}
            language={match ? match[1] : 'unknown'}
            showLineNumbers
          />
        );
      },
    }}
  >
    {children}
  </ReactMarkdown>
);

const ExpandablePane = ({ children, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={s2.button} onClick={() => setOpen((open) => !open)}>
        {open ? <TimesIcon /> : <PlusIcon />}
        {open ? `Hide ${label}` : `Show ${label}`}
      </button>
      {open && children}
    </>
  );
};

export const getStaticPaths = async () => {
  const sdkPages = await fetchSdkPages();

  return {
    fallback: 'blocking',
    paths: sdkPages.map(({ slug }) => ({ params: { slug } })),
  };
};

export const getStaticProps = handleErrors(async function ({
  params: { slug },
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
    variables: { groupSlug: 'plugin-sdk' },
    preview,
  });

  if (!docGroup) {
    return { notFound: true };
  }

  const sdkPages = await fetchSdkPages();

  const sdkPage = sdkPages.find((page) => page.slug === slug);

  if (!sdkPage) {
    return { notFound: true };
  }

  const content = await fetchSdkPageContent(sdkPage);

  const allHooks = await fetchPluginSdkHooks();

  const hooks = allHooks.filter((hook) =>
    hook.groups.includes(sdkPage.hooksGroup),
  );

  return {
    props: {
      docGroup,
      preview: preview ? true : false,
      sdkPages,
      sdkPage,
      content,
      hooks,
    },
  };
});

export default function DocPage({
  docGroup,
  sdkPage,
  sdkPages,
  hooks,
  content,
}) {
  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title={docGroup.name}
          entries={[
            ...docGroup.pages.map((page) => {
              return {
                url: `/docs/${docGroup.slug}${
                  page.page.slug === 'index' ? '' : `/${page.page.slug}`
                }`,
                label: page.titleOverride || page.page.title,
              };
            }),
            {
              label: 'SDK Reference',
              children: sdkPages.map((page) => {
                return {
                  url: `/docs/plugin-sdk/sdk/${page.slug}`,
                  label: page.title,
                };
              }),
            },
          ]}
        />
      }
    >
      <Head>
        <title>{sdkPage.title} - Building plugins</title>
      </Head>
      <div className={s.articleContainer}>
        <Toc
          extraEntries={hooks.map((hook) => ({
            anchor: hook.name,
            label: <code>{hook.name}</code>,
            tag: 'h4',
          }))}
        />
        <div className={s.article}>
          <div className={s.title}>{sdkPage.title}</div>
          <div className={s.body}>
            <Markdown>{content}</Markdown>
            {hooks
              .sort((a, b) => a.lineNumber - b.lineNumber)
              .map((hook) => {
                return (
                  <div key={hook.name}>
                    <Heading anchor={hook.name} as="h3">
                      <code>{hook.name}</code>
                    </Heading>
                    <Markdown>{hook.description}</Markdown>
                    {hook.returnType && (
                      <>
                        <Heading
                          anchor={`${hook.name}-context`}
                          as="h5"
                          className={s2.subchapter}
                        >
                          Return value
                        </Heading>
                        <p>
                          The function must return{' '}
                          {hook.returnType.isArray
                            ? 'an array of objects'
                            : 'an object'}{' '}
                          with the following structure:
                        </p>
                        <ExpandablePane label="structure">
                          <div className={s2.propertyGroup}>
                            {hook.returnType.properties
                              .sort((a, b) => a.lineNumber - b.lineNumber)
                              .map((item) => (
                                <div key={item.name} className={s2.hook}>
                                  <div className={s2.hookName}>
                                    <a
                                      href={`${baseUrl}#L${item.lineNumber}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {item.name}
                                      <GithubIcon />
                                    </a>{' '}
                                    {item.isOptional ? (
                                      <span className={s2.optional}>
                                        Optional
                                      </span>
                                    ) : (
                                      <span className={s2.required}>
                                        Required
                                      </span>
                                    )}
                                  </div>
                                  <div className={s2.hookDescription}>
                                    <Markdown>{item.description}</Markdown>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </ExpandablePane>
                      </>
                    )}
                    {hook.ctx && (
                      <>
                        <Heading
                          anchor={`${hook.name}-context`}
                          as="h5"
                          className={s2.subchapter}
                        >
                          Properties/methods available in context
                        </Heading>
                        <p>
                          The following information and methods are available:
                        </p>
                        {hook.ctx.map((group) => {
                          const name = group.name
                            .replace('AdditionalMethods', 'Methods')
                            .replace('AdditionalProperties', 'Properties')
                            .replace('Methods', ' methods')
                            .replace('Properties', ' properties');

                          return (
                            <ExpandablePane label={`${name}`} key={name}>
                              <div className={s2.groupDescription}>
                                <Markdown>{group.description}</Markdown>
                              </div>
                              <div className={s2.propertyGroup}>
                                {(group.properties || []).map((item) => (
                                  <div key={item.name} className={s2.hook}>
                                    <div className={s2.hookName}>
                                      <a
                                        href={`${baseUrl}#L${item.lineNumber}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {item.name}
                                        {item.type === 'function' ? '()' : ''}
                                        <GithubIcon />
                                      </a>
                                    </div>
                                    <div className={s2.hookDescription}>
                                      <Markdown>{item.description}</Markdown>
                                    </div>
                                    {item.example && (
                                      <Prism
                                        code={item.example}
                                        language="ts"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ExpandablePane>
                          );
                        })}
                      </>
                    )}
                    {hook.example && (
                      <Prism code={hook.example} language="js" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
