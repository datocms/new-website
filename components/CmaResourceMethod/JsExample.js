import React from 'react';
import humps from 'humps';
import sortObject from 'sort-object';
import pluralize from 'pluralize';
import Prism from 'components/Prism';

import schemaExampleFor from 'utils/schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const methods = {
  instances: 'all',
  self: 'find',
};

function example(resource, link, allPages = false) {
  let params = [];
  let precode = [];

  let placeholders = [];
  let match = regexp.exec(link.href);

  while (match != null) {
    placeholders.push(match[1]);
    match = regexp.exec(link.href);
  }

  placeholders.forEach(placeholder => {
    precode.push(`const ${humps.camelize(placeholder)}Id = '43';`);
    params.push(`${humps.camelize(placeholder)}Id`);
  });

  const deserialize = (data, withId = false) => {
    const id = withId ? { id: data.id } : {};

    const attrs = {
      ...id,
      ...sortObject(humps.camelizeKeys(data.attributes) || {}),
      ...sortObject(
        Object.entries(data.relationships || {}).reduce(
          (acc, [name, value]) => {
            acc[humps.camelize(name)] = value.data ? value.data.id : null;
            return acc;
          },
          {},
        ),
      ),
    };
    return attrs;
  };

  if (link.hrefSchema) {
    const example = schemaExampleFor(link.hrefSchema, !allPages);
    params.push(JSON.stringify(example, null, 2));

    if (allPages && link.targetSchema && link.targetSchema.properties.meta) {
      params.push(JSON.stringify({ allPages: true }, null, 2));
    }
  }

  if (link.schema) {
    const example = schemaExampleFor(link.schema, !allPages);

    if (example.data) {
      params.push(JSON.stringify(deserialize(example.data), null, 2));
    }
  }

  let returnCode, output;

  if (link.targetSchema) {
    const example = schemaExampleFor(link.targetSchema);

    if (Array.isArray(example.data)) {
      const singleVariable = humps.camelize(resource.id);
      const multipleVariable = humps.camelize(pluralize(resource.id));

      output = JSON.stringify(deserialize(example.data[0], true), null, 2);

      returnCode = `  .then((${multipleVariable}) => {
    ${multipleVariable}.forEach((${singleVariable}) => {
      console.log(${singleVariable});
    });
  })`;
    } else {
      const variable = humps.camelize(resource.id);
      output = JSON.stringify(deserialize(example.data, true), null, 2);

      returnCode = `  .then((${variable}) => {
    console.log(${variable});
  })`;
    }
  } else {
    returnCode = `  .then(() => {
    console.log('Done!');
  })`;
  }

  const namespace = resource.links.find(l => l.rel === 'instances')
    ? humps.camelize(pluralize(resource.id))
    : humps.camelize(resource.id);

  const action = humps.camelize(methods[link.rel] || link.rel);

  if (!allPages) {
    const code = `const SiteClient = require('datocms-client').SiteClient;
const client = new SiteClient("YOUR-API-KEY");
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${
      precode.length > 0 ? '\n' : ''
    }
client.${namespace}.${action}(${params.join(', ')})
${returnCode}
  .catch((error) => {
    console.log(error);
  });
${
  link.targetSchema && link.targetSchema.properties.meta
    ? '\n\n// if you want to fetch all the pages with just one call:\n' +
      example(resource, link, true).code
    : ''
}`;
    return { code, output };
  } else {
    const code = `
client.${namespace}.${action}(${params.join(', ')})
${returnCode}`;
    return { code, output };
  }
}

function renderExample(example, requestCode, responseCode) {
  return (
    <div className={s.root}>
      {example.title && <h6 className={s['title']}>{example.title}</h6>}
      <div className={s['snippet']}>
        <Prism code={example.request || requestCode} language="javascript" />
      </div>
      <div className={s['snippet']}>
        <div className={s['snippet__title']}>Result</div>
        <Prism code={example.response || responseCode} language="javascript" />
      </div>
    </div>
  );
}

export default function JsExample({ resource, link }) {
  const { code, output } = example(resource, link);

  const outputWithRun = `> node example.js\n\n${output}`;

  if (link.examples && link.examples.js) {
    return link.examples.js.map(example =>
      renderExample(example, code, outputWithRun),
    );
  }

  return renderExample({}, code, outputWithRun);
}
