import humps from 'humps';
import pluralize from 'pluralize';
import React from 'react';
import RequestResponse from '../RequestResponse';

import schemaExampleFor from 'utils/schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

export const jsonToJs = (string) =>
  string.replace(/"([^[\-"]+)": /g, '$1: ').replace(/"/g, "'");

function buildExample(resource, link, clientInfo, allPages = false) {
  const params = [];
  const precode = [];

  const placeholders = [];
  let match = regexp.exec(link.href);

  while (match != null) {
    placeholders.push(match[1]);
    match = regexp.exec(link.href);
  }

  const resourceId = resource.definitions.identity.example || '3209482753';

  for (const placeholder of placeholders) {
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
  }

  const deserialize = (data, withId = false) => {
    const id = withId ? { id: data.id } : {};

    const attrs = {
      ...id,
      ...(data.attributes || {}),
      ...(data.meta ? { meta: data.meta } : {}),
      ...Object.entries(data.relationships || {}).reduce(
        (acc, [name, value]) => {
          acc[name] = value.data;
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
        jsonToJs(
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
    if (Object.keys(example).length > 0) {
      params.push(jsonToJs(JSON.stringify(example, null, 2)));
    }
  }

  const namespace = clientInfo.namespace;
  const action = clientInfo.endpoint.name;

  let paramsCode = '';
  if (params.length > 0) {
    if (allPages) {
      paramsCode += `(\n${params.join(',\n').replace(/^/gm, '  ')}\n)`;
    } else {
      paramsCode += `(${params.join(', ')})`;
    }
  } else {
    paramsCode += '()';
  }

  const call = `client.${namespace}.${action}${paramsCode}`;

  let returnCode;
  let output;

  if (link.targetSchema || link.jobSchema) {
    const example = schemaExampleFor(link.jobSchema || link.targetSchema);

    const singleVariable = humps.camelize(resource.id);

    if (Array.isArray(example.data)) {
      const multipleVariable = humps.camelize(pluralize(resource.id));

      if (example.data.length > 0) {
        if (!allPages) {
          output = jsonToJs(
            JSON.stringify(deserialize(example.data[0], true), null, 2),
          );

          returnCode = `const ${multipleVariable} = await ${call};

${multipleVariable}.forEach((${singleVariable}) => {
  console.log(${singleVariable});
});`;
        } else {
          returnCode = `for await (const ${singleVariable} of client.${namespace}.${action}PagedIterator${paramsCode}) {
  console.log(${singleVariable});
}`;
        }
      } else {
        output = '[]';
        returnCode = `const result = await ${call};

console.log(result);`;
      }
    } else {
      output = jsonToJs(
        JSON.stringify(deserialize(example.data, true), null, 2),
      );

      returnCode = `const ${singleVariable} = await ${call};

console.log(${singleVariable});`;
    }
  } else {
    returnCode = `await ${call};`;
  }

  if (!allPages) {
    const isPaginated = clientInfo.endpoint.paginatedResponse;

    const body = `const client = buildClient({ apiToken: '<YOUR_API_TOKEN>' });
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${
  precode.length > 0 ? '\n' : ''
}${
  returnCode
    ? `${
        isPaginated ? '\n// this only returns the first page of results:' : ''
      }\n${returnCode}`
    : ''
}
${
  isPaginated
    ? `\n\n// this iterates over every page of results:${
        buildExample(resource, link, clientInfo, true).code
      }`
    : ''
}`;

    const code = `import { buildClient } from '@datocms/cma-client-node';

async function run() {
${body
  .trim()
  .split('\n')
  .map((x) => `  ${x}`)
  .join('\n')}
}

run();`;

    return { code, output };
  }
  const code = `
${returnCode}`;
  return { code, output };
}

export function JSExample({
  example,
  link,
  schema,
  clientInfo,
  startExpanded,
}) {
  const { code: requestCode, output: responseCode } = buildExample(
    schema,
    link,
    clientInfo,
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
        response.code && {
          title: 'Returned output',
          language: 'javascript',
          code: response.code,
          description: response.description,
        },
      ].filter(Boolean)}
    />
  );
}

export default function JsExamples({
  schema,
  link,
  clientInfo,
  omitExampleIds = [],
}) {
  if (link?.documentation?.javascript?.examples) {
    const examples = link.documentation.javascript.examples.filter(
      (example) => !omitExampleIds.includes(example.id),
    );

    if (examples.length === 0) {
      return null;
    }

    return (
      <>
        {examples.map((example) => (
          <JSExample
            key={example.id}
            example={example}
            link={link}
            schema={schema}
            clientInfo={clientInfo}
            startExpanded={true}
          />
        ))}
      </>
    );
  }

  return (
    <JSExample
      example={{ title: 'Basic example' }}
      link={link}
      schema={schema}
      clientInfo={clientInfo}
      startExpanded={true}
    />
  );
}
