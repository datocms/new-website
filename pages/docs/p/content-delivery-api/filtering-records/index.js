import DocsLayout from 'components/DocsLayout';
import PostContent from 'components/PostContent';
import {
  Toc,
  Sidebar,
  unstable_getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/p/[...chunks]';
import fetch from 'node-fetch';
import theme from 'custom-prism-react-renderer/themes/dracula';
import Highlight, { defaultProps } from 'custom-prism-react-renderer';
import s from 'pages/docs/pageStyle.css';
import humps from 'humps';
import { useState } from 'react';

export const unstable_getStaticProps = async () => {
  const { props } = await docPageUnstableGetStaticProps({
    params: { chunks: ['content-delivery-api', 'filtering-records'] },
  });

  const response = await fetch(
    'https://internal.datocms.com/introspection/field-filters',
  );

  const {
    meta: fieldsMetaInfo,
    field_types: fieldTypesInfo,
  } = await response.json();

  return { props: { ...props, fieldsMetaInfo, fieldTypesInfo } };
};

const exampleForType = (queryFieldName, field) => {
  let exampleData = '';
  const type = field.input_type;

  if (type === 'item_id' || type === 'upload_id') {
    exampleData = '"123"';
  } else if (type === 'boolean') {
    return 'true';
  } else if (type === 'string') {
    exampleData = '"bike"';
  } else if (type === 'enum') {
    exampleData = field.values[0];
  } else if (type === 'float') {
    exampleData = '19.99';
  } else if (type === 'integer') {
    exampleData = '3';
  } else if (type === 'date_time') {
    exampleData = '"2018-02-13T14:30:00+00:00"';
  } else if (type === 'date') {
    exampleData = '"2018-02-13"';
  } else if (queryFieldName === 'matches' || queryFieldName === 'not_matches') {
    exampleData = '{ pattern: "bi(cycl|k)e", caseSensitive: false }';
  } else if (queryFieldName === 'near') {
    exampleData = '{ latitude: 40.73, longitude: -73.93, radius: 10 }';
  } else {
    exampleData = type;
  }
  if (field.array) {
    return `[${exampleData}]`;
  }

  return exampleData;
};

const fieldTypes = {
  boolean: 'Boolean',
  color: 'Color',
  date: 'Date',
  date_time: 'DateTime',
  file: 'Single file',
  float: 'Floating-point number',
  gallery: 'Multiple files',
  image: 'Image',
  integer: 'Integer number',
  json: 'JSON',
  lat_lon: 'Geolocation',
  link: 'Single link',
  links: 'Multiple links',
  rich_text: 'Modular content',
  seo: 'SEO meta tags',
  slug: 'Slug',
  string: 'Single-line string',
  text: 'Multiple-paragraph text',
  video: 'Video',
};

const exampleForField = (field_name, queryFieldName, field) => {
  let filter = `${humps.camelize(queryFieldName)}: ${exampleForType(
    queryFieldName,
    field,
  )}`;

  if (filter.length > 35) {
    return `query {
  allProducts(
    filter: {
      ${field_name}: {
        ${filter}
      }
    }
  ) {
    title
  }
}`;
  }

  return `query {
  allProducts(filter: { ${field_name}: { ${filter} } }) {
    title
  }
}`;
};

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="Tabs">
      <div className="Tabs__handles">
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className="Tab__handle"
          >
            <span>{child.props.title}</span>
          </button>
        ))}
      </div>
      {React.Children.map(children, (child, index) => {
        if (!child) {
          return undefined;
        }

        return (
          <div
            key="content"
            className="Tabs__content"
            style={{
              display: activeTab === index ? 'block' : 'none',
            }}
          >
            {child.props.children}
          </div>
        );
      })}
    </div>
  );
};

const Tab = ({ title, children }) => {
  return (
    <div>
      <div>{title}</div>
      <div>{children}</div>
    </div>
  );
};

const Filters = ({ name, attrs }) => {
  return (
    <Tabs handlesAsCode>
      {Object.keys(attrs).map(key => (
        <Tab key={key} title={humps.camelize(key)}>
          <div className={s.filterDescription}>{attrs[key].description}</div>
          <Highlight
            {...defaultProps}
            theme={theme}
            code={exampleForField(name, key, attrs[key].input)}
            language={'graphql'}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
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
    <DocsLayout sidebar={<Sidebar docGroup={docGroup} />}>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <PostContent content={page.content} style={s}>
            <h3 id="meta-fields">
              {/* <Anchor id="meta-fields" /> */}
              Meta fields
            </h3>
            {Object.keys(fieldsMetaInfo).map(name => (
              <React.Fragment key={name}>
                <h4 id={name}>
                  {/* <Anchor id={name} /> */}
                  Filter by <code>{name}</code> meta field
                </h4>
                <Filters name={name} attrs={fieldsMetaInfo[name]} />
              </React.Fragment>
            ))}
            <h3>
              {/* <Anchor id="field-types" /> */}
              Filters available per field type
            </h3>
            {Object.keys(fieldTypesInfo).map(name => (
              <React.Fragment key={name}>
                <h4 id={name}>
                  {/* <Anchor id={name} /> */}
                  {fieldTypes[name]} fields
                </h4>
                <Filters name={name} attrs={fieldTypesInfo[name]} />
              </React.Fragment>
            ))}
          </PostContent>
        </div>
        <Toc content={page.content} />
      </div>
    </DocsLayout>
  );
}
