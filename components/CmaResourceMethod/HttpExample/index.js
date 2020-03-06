import React from 'react';
import schemaExampleFor from 'utils/schemaExampleFor';
import queryString from 'qs';
import RequestResponse from '../RequestResponse';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

const toParam = schema => {
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

function renderExample(example, resource) {
  const { request, response, title } = example;

  const params = resource.hrefSchema ? toParam(resource.hrefSchema) : '';

  let requestCode =
    request && request.method
      ? `${request.method} ${request.url.replace(regexp, ':$1_id') +
          params} HTTP/1.1`
      : `${resource.method} ${'https://site-api.datocms.com' +
          resource.href.replace(regexp, ':$1_id') +
          params} HTTP/1.1`;

  requestCode += '\n\n';

  requestCode +=
    request && request.headers
      ? Object.entries(request.headers)
          .map(([name, value]) => `${name}: ${value}`)
          .join('\n')
      : [
          'X-Api-Version: 3',
          'Authorization: Bearer YOUR-API-KEY',
          'Accept: application/json',
        ]
          .concat(
            resource.schema &&
              resource.method !== 'GET' &&
              resource.method !== 'DELETE' && [
                'Content-Type: application/json',
              ],
          )
          .filter(x => x)
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
    responseCode = `HTTP/1.1 ${(response && response.statusCode) ||
      '200'} ${(response && response.statusText) || 'OK'}`;

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
    <div>
      {title && <h6>{title}</h6>}
      <RequestResponse
        chunks={[
          { title: 'HTTP Request:', code: requestCode, language: 'http' },
          responseCode && {
            title: 'HTTP Response:',
            code: responseCode,
            language: 'http',
          },
        ].filter(x => !!x)}
      />
    </div>
  );
}

export default class HttpExample extends React.Component {
  render() {
    const { link } = this.props;

    if (link.examples && link.examples.http) {
      return link.examples.http.map(example => renderExample(example, link));
    }

    return renderExample({}, link);
  }
}
