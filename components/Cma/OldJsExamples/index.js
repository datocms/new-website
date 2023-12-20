import humps from 'humps';
import pluralize from 'pluralize';
import React from 'react';
import RequestResponse from '../RequestResponse';

import schemaExampleFor from 'utils/schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const methods = {
  instances: 'all',
  self: 'find',
};

const fix = (string) =>
  string.replace(/"([^[\-"]+)": /g, '$1: ').replace(/"/g, "'");

function buildExample(resource, link, allPages = false) {
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

    const singleVariable = humps.camelize(resource.id);

    if (Array.isArray(example.data)) {
      const multipleVariable = humps.camelize(pluralize(resource.id));

      if (example.data.length > 0) {
        output = fix(
          JSON.stringify(deserialize(example.data[0], true), null, 2),
        );

        returnCode = `const ${multipleVariable} = await ${call};

  ${multipleVariable}.forEach((${singleVariable}) => {
    console.log(${singleVariable});
  });`;
      } else {
        output = '[]';
        returnCode = `const result = await ${call};

console.log(result);`;
      }
    } else {
      output = fix(JSON.stringify(deserialize(example.data, true), null, 2));

      returnCode = `const ${singleVariable} = await ${call};

console.log(${singleVariable});`;
    }
  } else {
    returnCode = `await ${call};`;
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
      buildExample(resource, link, true).code
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

export function OldJsExample({ example, schema, link, startExpanded }) {
  const { code: requestCode, output: responseCode } = buildExample(
    schema,
    link,
  );
  const response = example.response ? example.response : { code: responseCode };

  return (
    <RequestResponse
      title={example.title}
      description={example.description}
      startExpanded={startExpanded}
      chunks={[
        {
          title: 'Code',
          language: 'javascript',
          description: example.request?.description,
          code: example.request?.code || requestCode,
        },
        (example.response || responseCode) && {
          title: 'Returned output',
          language: 'javascript',
          code: response.code,
          description: response.description,
        },
      ].filter((x) => x)}
    />
  );
}

export default function JsExamples({ schema, link, omitExampleIds = [] }) {
  if (link?.documentation?.['old-js']?.examples) {
    const examples = link.documentation['old-js'].examples.filter(
      (example) => !omitExampleIds.includes(example.id),
    );

    if (examples.length === 0) {
      return null;
    }

    return (
      <>
        {examples.map((example) => (
          <OldJsExample
            key={example.id}
            example={example}
            link={link}
            schema={schema}
            startExpanded={true}
          />
        ))}
      </>
    );
  }

  return (
    <OldJsExample
      example={{ title: 'Basic example' }}
      link={link}
      schema={schema}
      startExpanded={true}
    />
  );
}
