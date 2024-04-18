import DocPageContent from 'components/DocPageContent';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import Heading from 'components/Heading';
import Prism from 'components/Prism';
import Space from 'components/Space';
import Tabs, { Tab } from 'components/Tabs';
import { handleErrors } from 'lib/datocms';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import React from 'react';
import { renderMetaTags } from 'react-datocms';
import tiny from 'tiny-json-http';
import { camelize, exampleForUpload } from 'utils/gqlExampleForField';
import { useQuerySubscription } from 'utils/useQuerySubscription';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const { props } = await docPageGetStaticProps({
    params: { chunks: ['content-delivery-api', 'filtering-uploads'] },
    preview,
  });

  if (!props) {
    return { notFound: true };
  }

  const {
    body: { filters },
  } = await tiny.get({
    url: 'https://internal.datocms.com/introspection/upload-filters',
  });

  return { props: { ...props, filters } };
});

const Filters = ({ name, attrs }) => {
  return (
    <Space both={1}>
      <Tabs>
        {Object.keys(attrs).map((key) => (
          <Tab key={key} title={camelize(key)} code>
            <div className={s.filterDescription}>{attrs[key].description}</div>
            <Prism
              code={exampleForUpload(name, key, attrs[key].input)}
              language={'graphql'}
            />
          </Tab>
        ))}
      </Tabs>
    </Space>
  );
};

export default function DocPage({
  docGroup,
  titleOverride,
  pageSubscription,
  filters,
}) {
  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;

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
          extraEntries={Object.keys(filters).map((name) => ({
            anchor: name,
            label: `Filter by ${camelize(name)}`,
            tag: 'h3',
          }))}
        />
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <DocPageContent content={page.content} style={s}>
            <Heading anchor="meta-fields" as="h3">
              Available filters
            </Heading>
            {Object.keys(filters).map((name) => (
              <React.Fragment key={name}>
                <Heading anchor={name} as="h4">
                  Filter by <code>{camelize(name)}</code>
                </Heading>
                <Filters name={name} attrs={filters[name]} />
              </React.Fragment>
            ))}
          </DocPageContent>
        </div>
      </div>
    </DocsLayout>
  );
}
