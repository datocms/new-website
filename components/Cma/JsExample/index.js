import React from 'react';
import humps from 'humps';
import pluralize from 'pluralize';
import RequestResponse from '../RequestResponse';
import slugify from 'utils/slugify';

import schemaExampleFor from 'utils/schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const methods = {
  instances: 'all',
  self: 'find',
};

const fix = (string) =>
  string.replace(/"([^[\-"]+)": /g, '$1: ').replace(/"/g, "'");

function example(resource, link, allPages = false) {
  let params = [];
  let precode = [];

  let placeholders = [];
  let match = regexp.exec(link.href);

  while (match != null) {
    placeholders.push(match[1]);
    match = regexp.exec(link.href);
  }

  const resourceId = resource.definitions.identity.example || '43';

  placeholders.forEach((placeholder) => {
    if (placeholder === 'item_type') {
      precode.push(`const modelIdOrApiKey = 'blog_post';`);
      params.push('modelIdOrApiKey');
    } else if (placeholder === 'field') {
      precode.push(`const fieldIdOrApiKey = 'blog_post::title';`);
      params.push('fieldIdOrApiKey');
    } else {
      precode.push(`const ${humps.camelize(placeholder)}Id = '${resourceId}';`);
      params.push(`${humps.camelize(placeholder)}Id`);
    }
  });

  const deserialize = (data, withId = false) => {
    const id = withId ? { id: data.id } : {};

    const attrs = {
      ...id,
      ...(humps.camelizeKeys(data.attributes) || {}),
      ...(data.meta ? { meta: data.meta } : {}),
      ...Object.entries(data.relationships || {}).reduce(
        (acc, [name, value]) => {
          acc[humps.camelize(name)] = Array.isArray(value.data)
            ? value.data.map((el) => el.id)
            : value.data
            ? value.data.id
            : null;
          return acc;
        },
        {},
      ),
    };
    return attrs;
  };

  if (link.schema && (link.method === 'PUT' || link.method === 'POST')) {
    const example = schemaExampleFor(link.schema, !allPages);
    if (example.data) {
      params.push(
        fix(
          JSON.stringify(
            deserialize(example.data, link.method === 'POST'),
            null,
            2,
          ),
        ),
      );
    }
  }

  if (link.hrefSchema) {
    const example = schemaExampleFor(link.hrefSchema, !allPages);
    params.push(fix(JSON.stringify(example, null, 2)));

    if (allPages && link.targetSchema && link.targetSchema.properties.meta) {
      params.push(fix(JSON.stringify({ allPages: true }, null, 2)));
    }
  }

  const namespace = resource.links.find((l) => l.rel === 'instances')
    ? humps.camelize(pluralize(resource.id))
    : humps.camelize(resource.id);

  const action = humps.camelize(methods[link.rel] || link.rel);

  let call = `client.${namespace}.${action}`;
  if (params.length > 0) {
    if (allPages) {
      call += `(\n${params.join(',\n').replace(/^/gm, '  ')}\n)`;
    } else {
      call += `(${params.join(', ')})`;
    }
  } else {
    call += '()';
  }

  let returnCode, output;

  if (link.targetSchema || link.jobSchema) {
    const example = schemaExampleFor(link.jobSchema || link.targetSchema);

    if (Array.isArray(example.data)) {
      const singleVariable = humps.camelize(resource.id);
      const multipleVariable = humps.camelize(pluralize(resource.id));

      output =
        example.data.length > 0 &&
        JSON.stringify(deserialize(example.data[0], true), null, 2);

      returnCode =
        example.data.length > 0 &&
        `const ${multipleVariable} = await ${call};

${multipleVariable}.forEach((${singleVariable}) => {
  console.log(${singleVariable});
});`;
    } else {
      const variable = humps.camelize(resource.id);
      output = JSON.stringify(deserialize(example.data, true), null, 2);

      returnCode = `const ${variable} = await ${call};

console.log(${variable});`;
    }
  }

  if (!allPages) {
    const body = `const client = new SiteClient('YOUR-API-TOKEN');
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${
      returnCode ? `\n${returnCode}` : ''
    }
${
  link.targetSchema &&
  link.targetSchema.properties.meta &&
  link.targetSchema.properties.meta.properties.total_count
    ? '\n\n// or, if you want to fetch all the pages with just one call:\n' +
      example(resource, link, true).code
    : ''
}`;

    let code = `const { SiteClient } = require('datocms-client');

async function run() {
${body
  .trim()
  .split('\n')
  .map((x) => `  ${x}`)
  .join('\n')}
}

run();`;

    return { code, output };
  } else {
    const code = `
${returnCode}`;
    return { code, output };
  }
}

function renderExample(example, requestCode, responseCode) {
  return (
    <div>
      <RequestResponse
        title={example.title}
        description={example.description}
        chunks={[
          {
            title: 'Example code:',
            language: 'javascript',
            code: example.request || requestCode,
          },
          (example.response || responseCode) && {
            title: 'Returned output:',
            language: 'javascript',
            code: example.response || responseCode,
          },
        ].filter((x) => x)}
      />
    </div>
  );
}

export default function JsExample({ resource, link }) {
  const { code, output } = example(resource, link);

  const outputWithRun = output && `> node example.js\n\n${output}`;

  if (link.examples && link.examples.js) {
    return (
      <>
        <ul>
          {link.examples.js.map((example) => (
            <li key={example.title}>
              <a href={`#${slugify(example.title)}`}>{example.title}</a>
            </li>
          ))}
        </ul>
        {link.examples.js.map((example) =>
          renderExample(example, code, outputWithRun),
        )}
      </>
    );
  }

  return renderExample({}, code, outputWithRun);
}
