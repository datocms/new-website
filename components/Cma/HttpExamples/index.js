import status from 'http-status';
import React from 'react';
import schemaExampleFor from 'utils/schemaExampleFor';
import { jsonToJs } from '../JsExamples';
import RequestResponse from '../RequestResponse';
import { generateCurlSnippet } from './generateCurlSnippet';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

function addSearchParamsToRequestUrl(url, link) {
  if (!link?.hrefSchema) {
    return;
  }

  for (const [param, value] of Object.entries(
    schemaExampleFor(link.hrefSchema),
  )) {
    url.searchParams.set(param, value);
  }
}

function defaultRequestHeaders(link) {
  const result = {
    Authorization: 'Bearer YOUR-API-TOKEN',
    Accept: 'application/json',
    'X-Api-Version': '3',
  };

  if (link.schema && link.method !== 'GET' && link.method !== 'DELETE') {
    result['Content-Type'] = 'application/vnd.api+json';
  }

  return result;
}

function parseJsonBody(body) {
  if (typeof body !== 'string') {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}

function buildFetchRequest({ request }, link) {
  const rawRequestUrl = (request?.url || link.href).replace(
    regexp,
    (_matched, chunk) => {
      if (chunk === 'item_type') {
        return ':model_id_or_api_key';
      }

      if (chunk === 'field') {
        return ':field_id_or_api_key';
      }

      return `:${chunk}_id`;
    },
  );

  const rawRequestAsURL = new URL(
    rawRequestUrl,
    'https://site-api.datocms.com',
  );

  addSearchParamsToRequestUrl(rawRequestAsURL, link);

  const method = request?.method || link.method;

  return [
    rawRequestAsURL.toString(),
    {
      method,
      headers: request?.headers || defaultRequestHeaders(link),
      body:
        link.schema && method !== 'GET' && method !== 'DELETE'
          ? request?.body !== undefined
            ? parseJsonBody(request.body)
            : schemaExampleFor(link.schema)
          : undefined,
    },
  ];
}

function buildResponse({ response }, link) {
  if (!link.targetSchema) {
    return null;
  }

  const statusCode = link.jobSchema ? '202' : response?.statusCode || '200';

  return {
    statusCode,
    statusText: status[statusCode],
    headers: response?.headers || {
      'Content-Type': 'application/json',
      'Cache-Control': 'cache-control: max-age=0, private, must-revalidate',
      'X-RateLimit-Limit': '30',
      'X-RateLimit-Remaining': '28',
    },
    body: response?.body
      ? response.body.trim()
      : link.targetSchema
      ? JSON.stringify(schemaExampleFor(link.targetSchema), null, 2).trim()
      : null,
  };
}

function buildHttpRequest([url, requestInit = {}]) {
  let result = `${requestInit.method || 'GET'} ${url} HTTP/1.1`;

  if (requestInit.headers) {
    result += '\n\n';

    result += Object.entries(requestInit.headers)
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n');
  }

  if (requestInit.body) {
    const body =
      typeof requestInit.body === 'string'
        ? requestInit.body
        : JSON.stringify(requestInit.body, null, 2);

    result += `\n\n${body}`;
  }

  return result;
}

function buildFetchCommand([url, requestInit = {}]) {
  return `await fetch(
  '${url}',
  {
    ${Object.entries(requestInit)
      .map(([option, value]) => {
        if (option === 'method' && value === 'GET') {
          return null;
        }

        if (option !== 'body') {
          return `${option}: ${jsonToJs(
            JSON.stringify(value, null, 2).split('\n').join('\n    '),
          )},`;
        }

        if (!value) {
          return null;
        }

        if (typeof value === 'string') {
          return `body: ${JSON.stringify(value)},`;
        }

        return `body: JSON.stringify(${jsonToJs(
          JSON.stringify(value, null, 2).split('\n').join('\n    '),
        )}),`;
      })
      .filter(Boolean)
      .join('\n    ')}
  }
);`;
}

function buildHttpResponse(response) {
  if (!response) {
    return null;
  }

  let result = `HTTP/1.1 ${response.statusCode} ${response.statusText}`;

  result += '\n\n';

  result += Object.entries(response.headers)
    .map(([name, value]) => `${name}: ${value}`)
    .join('\n');

  if (response.body) {
    result += `\n\n${response.body}`;
  }

  return result;
}

export function HttpExample({ example, link, startExpanded }) {
  const request = buildFetchRequest(example, link);
  const response = buildResponse(example, link);

  const chunks = [
    {
      title: 'HTTP Request',
      code: buildHttpRequest(request),
      language: 'http',
      description: example.request?.description ?? '',
    },
    {
      title: 'CURL Request',
      code: generateCurlSnippet(request),
      language: 'bash',
      description: example.request?.description ?? '',
    },
    {
      title: 'fetch() Request',
      code: buildFetchCommand(request),
      language: 'js',
      description: example.request?.description ?? '',
    },
  ];

  if (response) {
    chunks.push({
      title: 'HTTP Response',
      code: buildHttpResponse(response),
      language: 'http',
      description: example.response?.description ?? '',
    });
  }

  return (
    <RequestResponse
      title={example.title}
      description={example.description}
      startExpanded={startExpanded}
      chunks={chunks}
    />
  );
}

export default class HttpExamples extends React.Component {
  render() {
    const { link, jobRetrieveLink, omitExampleIds } = this.props;

    if (link?.documentation?.http?.examples) {
      const examples = link.documentation.http.examples.filter(
        (example) => !omitExampleIds.includes(example.id),
      );

      if (examples.length === 0) {
        return null;
      }

      return (
        <>
          {examples.map((example) => (
            <HttpExample
              key={example.id}
              example={example}
              link={link}
              startExpanded={true}
            />
          ))}
        </>
      );
    }

    if (link.jobSchema) {
      const response = schemaExampleFor(jobRetrieveLink.targetSchema);

      response.data.attributes.payload = schemaExampleFor(link.jobSchema);

      return (
        <>
          <HttpExample
            example={{ title: 'Step 1: Perform the request' }}
            link={link}
            startExpanded={true}
          />
          <HttpExample
            example={{
              title: 'Step 2: Poll for the job result',
              response: { body: JSON.stringify(response, null, 2) },
            }}
            link={jobRetrieveLink}
            startExpanded={true}
          />
        </>
      );
    }

    return (
      <HttpExample
        example={{ title: 'Basic example' }}
        link={link}
        startExpanded={true}
      />
    );
  }
}
