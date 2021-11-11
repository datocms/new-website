import { useMemo } from 'react';
import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import {
  Toc,
  Sidebar,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import Heading from 'components/Heading';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import { fetchPluginSdkHooks } from 'utils/fetchPluginSdk';
import ReactMarkdown from 'react-markdown';
import { parse } from 'flatted';
import { Properties } from 'components/Cma/Schema';
import Prism from 'components/Prism';
import { handleErrors } from 'lib/datocms';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const { props } = await docPageGetStaticProps({
    params: { chunks: ['building-plugins', 'sdk-reference-2'] },
    preview,
  });

  const hooks = await fetchPluginSdkHooks();

  return { props: { ...props, hooks } };
});

export default function DocPage({ docGroup, titleOverride, page, hooks }) {
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
              label: page.titleOverride || page.page.title,
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
            ...hooks.map((hook) => {
              return {
                anchor: hook.name,
                label: (
                  <>
                    <code>{hook.name}</code>
                  </>
                ),
                tag: 'h4',
              };
            }),
          ]}
        />
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <PostContent content={page.content} style={s}>
            <Heading anchor="nodes" as="h3">
              Hooks
            </Heading>
            {hooks.map((hook) => {
              return (
                <div key={hook.name}>
                  <Heading anchor={hook.name} as="h4">
                    <code>{hook.name}</code>
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
                    {hook.description}
                  </ReactMarkdown>
                  {hook.example && <Prism code={hook.example} language="js" />}
                </div>
              );
            })}
          </PostContent>
        </div>
      </div>
    </DocsLayout>
  );
}
