import queryString from 'qs';
import React from 'react';
import schemaExampleFor from 'utils/schemaExampleFor';
import RequestResponse from '../RequestResponse';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const toParam = (schema) => {
  const params = (
    schema.required || Object.keys(schema.properties).slice(0, 2)
  ).reduce((acc, k) => {
    acc[k] = schema.properties[k]['example'];
    return acc;
  }, {});

  return Object.entries(params).length > 0
    ? `?${queryString.stringify(params)}`
    : '';
};

export function HttpExample({ example, link: resource, startExpanded }) {
  const { request, response, title, description } = example;

  const params = resource.hrefSchema ? toParam(resource.hrefSchema) : '';

  const pathnameWithPlaceholders = (
    request ? request.url : resource.href
  ).replace(regexp, (_matched, chunk) => {
    console.log(chunk);

    if (chunk === 'item_type') {
      return `:model_id_or_api_key`;
    }

    if (chunk === 'field') {
      return `:field_id_or_api_key`;
    }

    return `:${chunk}_id`;
  });

  let requestCode =
    request && request.method
      ? `${request.method} ${pathnameWithPlaceholders + params} HTTP/1.1`
      : `${resource.method} ${
          'https://site-api.datocms.com' + pathnameWithPlaceholders + params
        } HTTP/1.1`;

  requestCode += '\n\n';

  requestCode +=
    request && request.headers
      ? Object.entries(request.headers)
          .map(([name, value]) => `${name}: ${value}`)
          .join('\n')
      : [
          'X-Api-Version: 3',
          'Authorization: Bearer YOUR-API-TOKEN',
          'Accept: application/json',
        ]
          .concat(
            resource.schema &&
              resource.method !== 'GET' &&
              resource.method !== 'DELETE' && [
                'Content-Type: application/vnd.api+json',
              ],
          )
          .filter((x) => x)
          .join('\n');

  if (
    resource.schema &&
    resource.method !== 'GET' &&
    resource.method !== 'DELETE'
  ) {
    requestCode += '\n\n';

    requestCode +=
      request && request.body !== undefined
        ? request.body.trim()
        : JSON.stringify(schemaExampleFor(resource.schema), null, 2).trim();
  }

  let responseCode = '';

  if (resource.targetSchema) {
    let statusCode = (response && response.statusCode) || '200';
    statusCode = resource.jobSchema ? '202' : statusCode;
    responseCode = `HTTP/1.1 ${statusCode} ${
      (response && response.statusText) || 'OK'
    }`;

    responseCode += '\n\n';

    responseCode +=
      response && response.headers
        ? Object.entries(response.headers)
            .map(([name, value]) => `${name}: ${value}`)
            .join('\n')
        : [
            'Content-Type: application/json',
            'Cache-Control: cache-control: max-age=0, private, must-revalidate',
            'X-RateLimit-Limit: 30',
            'X-RateLimit-Remaining: 28',
          ].join('\n');

    if ((response && response.body) || resource.targetSchema) {
      responseCode += '\n\n';

      responseCode +=
        response && response.body !== undefined
          ? response.body.trim()
          : JSON.stringify(
              schemaExampleFor(resource.targetSchema),
              null,
              2,
            ).trim();
    }
  }

  return (
    <RequestResponse
      title={title}
      description={description}
      startExpanded={startExpanded}
      chunks={[
        {
          title: 'HTTP Request',
          code: requestCode,
          language: 'http',
          description: request?.description ?? '',
        },
        responseCode && {
          title: 'HTTP Response',
          code: responseCode,
          language: 'http',
          description: response?.description ?? '',
        },
      ].filter((x) => !!x)}
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
