import React from 'react';
import pluralize from 'pluralize';
import schemaExampleFor from 'utils/schemaExampleFor';
import RequestResponse from '../RequestResponse';

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

  const resourceId = resource.definitions.identity.example || '43';

  placeholders.forEach((placeholder) => {
    if (placeholder === 'item_type') {
      precode.push(`model_id_or_api_key = "blog_post"`);
      params.push('model_id_or_api_key');
    } else if (placeholder === 'field') {
      precode.push(`field_id_or_api_key = "blog_post::title"`);
      params.push('field_id_or_api_key');
    } else {
      precode.push(`${placeholder}_id = "${resourceId}"`);
      params.push(`${placeholder}_id`);
    }
  });

  const fix = (string) =>
    string
      .replace(/}$/, '')
      .replace(/^{/, '')
      .replace(/"([^"]+)": /g, '$1: ')
      .replace(/null/g, 'nil');

  const deserialize = (data, withId = false) => {
    const id = withId ? { id: data.id } : {};

    const attrs = {
      ...id,
      ...(data.attributes || {}),
      ...(data.meta ? { meta: data.meta } : {}),
      ...Object.entries(data.relationships || {}).reduce(
        (acc, [name, value]) => {
          acc[name] = Array.isArray(value.data)
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

  if (link.hrefSchema) {
    const example = schemaExampleFor(link.hrefSchema, !allPages);
    params.push(fix(JSON.stringify(example, null, 2)));

    if (allPages && link.targetSchema && link.targetSchema.properties.meta) {
      params.push(fix(JSON.stringify({ all_pages: true }, null, 2)));
    }
  }

  if (link.schema && (link.method === 'PUT' || link.method === 'POST')) {
    const example = schemaExampleFor(link.schema, !allPages);

    if (example.data) {
      params.push(fix(JSON.stringify(deserialize(example.data), null, 2)));
    }
  }

  const namespace = resource.links.find((l) => l.rel === 'instances')
    ? pluralize(resource.id)
    : resource.id;

  let call = `client.${namespace}.${methods[link.rel] || link.rel}`;
  if (params.length > 0) {
    if (allPages) {
      call += `(\n${params.join(',\n').replace(/^/gm, '  ')}\n)`;
    } else {
      call += `(${params.join(', ')})`;
    }
  }

  let returnCode = '';
  let output;

  if (link.targetSchema || link.jobSchema) {
    const example = schemaExampleFor(link.jobSchema || link.targetSchema);
    const variable = resource.id;

    if (Array.isArray(example.data) && example.data.length > 0) {
      output = JSON.stringify(deserialize(example.data[0], true), null, 2)
        .replace(/": /g, '" => ')
        .replace(/null/g, 'nil');

      returnCode = `${call}.each do |${variable}|
  puts ${variable}.inspect
end`;
    } else {
      output = JSON.stringify(deserialize(example.data, true), null, 2)
        .replace(/": /g, '" => ')
        .replace(/null/g, 'nil');
      returnCode = `${variable} = ${call}

puts ${variable}.inspect
`;
    }
  }

  if (!allPages) {
    const code = `require "dato"

client = Dato::Site::Client.new("YOUR-API-TOKEN")
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${
      precode.length > 0 ? '\n' : ''
    }${returnCode ? `\n${returnCode}` : ''}
${
  link.targetSchema &&
  link.targetSchema.properties.meta &&
  link.targetSchema.properties.meta.properties.total_count
    ? '\n\n# if you want to fetch all the pages with just one call:\n\n' +
      example(resource, link, true).code
    : ''
}`;
    return { code, output };
  } else {
    return { code: returnCode, output };
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
            code: (example.request || requestCode).trim(),
            language: 'ruby',
          },
          (example.response || responseCode) && {
            title: 'Returned output:',
            code: (example.response || responseCode).trim(),
            language: 'ruby',
          },
        ].filter((x) => !!x)}
      />
    </div>
  );
}

export default function RubyExample({ resource, link }) {
  const { code, output } = example(resource, link);

  const outputWithRun = `> ruby example.rb\n\n${output}`;

  if (link.examples && link.examples.ruby) {
    return link.examples.ruby.map((example) =>
      renderExample(example, code, outputWithRun),
    );
  }

  return renderExample({}, code, outputWithRun);
}
