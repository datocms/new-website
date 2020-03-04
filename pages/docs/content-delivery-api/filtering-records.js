import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import Tabs, { Tab } from 'components/Tabs';
import {
  Toc,
  Sidebar,
  getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/[...chunks]';
import tiny from 'tiny-json-http';
import Prism from 'components/Prism';
import s from 'pages/docs/pageStyle.css';
import gqlExampleForField, { camelize } from 'utils/gqlExampleForField';
import fieldTypes from 'utils/fieldTypes';
import Heading from 'components/Heading';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';

export const getStaticProps = async () => {
  const { props } = await docPageUnstableGetStaticProps({
    params: { chunks: ['content-delivery-api', 'filtering-records'] },
  });

  const {
    body: { meta: fieldsMetaInfo, field_types: fieldTypesInfo },
  } = await tiny.get({
    url: 'https://internal.datocms.com/introspection/field-filters',
  });

  return { props: { ...props, fieldsMetaInfo, fieldTypesInfo } };
};

const Filters = ({ name, attrs }) => {
  return (
    <Tabs>
      {Object.keys(attrs).map(key => (
        <Tab key={key} title={camelize(key)}>
          <div className={s.filterDescription}>{attrs[key].description}</div>
          <Prism
            code={gqlExampleForField(name, key, attrs[key].input)}
            language={'graphql'}
          />
        </Tab>
      ))}
    </Tabs>
  );
};

export default function DocPage({
  docGroup,
  titleOverride,
  page,
  fieldsMetaInfo,
  fieldTypesInfo,
}) {
  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title={docGroup.name}
          entries={docGroup.pages.map(page => {
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
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <PostContent content={page.content} style={s}>
            <Heading anchor="field-types" as="h3">
              Filters available for field types
            </Heading>
            {Object.keys(fieldTypesInfo).map(name => (
              <React.Fragment key={name}>
                <Heading anchor={name} as="h4">
                  {fieldTypes[name]} fields
                </Heading>
                <Filters name={name} attrs={fieldTypesInfo[name]} />
              </React.Fragment>
            ))}
            <Heading anchor="meta-fields" as="h3">
              Filters available for meta fields
            </Heading>
            {Object.keys(fieldsMetaInfo).map(name => (
              <React.Fragment key={name}>
                <Heading anchor={name} as="h4">
                  Filter by <code>{camelize(name)}</code> meta field
                </Heading>
                <Filters name={name} attrs={fieldsMetaInfo[name]} />
              </React.Fragment>
            ))}
          </PostContent>
        </div>
        <Toc
          content={page.content}
          extraEntries={[].concat(
            [
              {
                anchor: 'field-types',
                label: 'Filters available for field types',
              },
            ],
            Object.keys(fieldTypesInfo).map(name => ({
              anchor: name,
              label: `${fieldTypes[name]} fields`,
            })),
          )}
        />
      </div>
    </DocsLayout>
  );
}
