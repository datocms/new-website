import React from 'react';
import schemaExampleFor from 'utils/schemaExampleFor';
import Prism from 'components/Prism';
import queryString from 'qs';
import s from './style.css';

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

const Headers = ({ children }) => (
  <div className={s['headers']}>{children}</div>
);

const Header = ({ name, children, value }) => (
  <div className={s['header']}>
    <span className="token keyword">{name}:&nbsp;</span>
    <span className="token string">{value || children}</span>
  </div>
);

const HttpStatus = ({ status }) => (
  <div>
    <span className="token punctuation">HTTP/1.1</span>&nbsp;
    <span className="token keyword">{status}</span>
  </div>
);

const HttpRequest = ({ method, url, hrefSchema }) => {
  const params = hrefSchema ? toParam(hrefSchema) : '';

  return (
    <div>
      <span className="token keyword">{method}</span>
      &nbsp;
      <span
        dangerouslySetInnerHTML={{
          __html:
            url.replace(
              regexp,
              '<span class="HttpExample__placeholder">:$1_id</span>',
            ) +
            params,
        }}
      />{' '}
      <span className="token punctuation">HTTP/1.1</span>
    </div>
  );
};

const JsonBody = ({ payload }) => (
  <Prism
    code={payload}
    language="json"
  />
);

function defaultRequestHeaders(link) {
  return (
    <>
      <Header name="X-Api-Version" value={3} />
      <Header name="Authorization">
        Bearer <span className={s['placeholder']}>YOUR-API-KEY</span>
      </Header>
      <Header name="Accept" value="application/json" />
      {link.schema && link.method !== 'GET' && link.method !== 'DELETE' && (
        <Header name="Content-Type" value="application/json" />
      )}
    </>
  );
}

function defaultResponseHeaders() {
  return (
    <>
      <Header name="Content-Type" value="application/json; charset=utf-8" />
      <Header
        name="Cache-Control"
        value="cache-control: max-age=0, private, must-revalidate"
      />
      <Header name="X-RateLimit-Limit" value="30" />
      <Header name="X-RateLimit-Remaining" value="28" />
    </>
  );
}

function renderExample(example, resource) {
  const { request, response, title } = example;
  return (
    <div className={s.root}>
      {title &&
        <h6 className={s['title']}>{title}</h6>
      }
      <div className={s['snippet']}>
        <pre className="language-text">
          <code>
            {request && request.method ? (
              <HttpRequest
                method={request.method}
                url={request.url}
              />
            ) : (
              <HttpRequest
                method={resource.method}
                url={'https://site-api.datocms.com' + resource.href}
                hrefSchema={resource.hrefSchema}
              />
            )}
            <Headers>
              {request && request.headers
                ? Object.entries(request.headers).map(([name, value]) => (
                    <Header name={name} value={value} />
                  ))
                : defaultRequestHeaders(resource)}
            </Headers>
            {resource.schema &&
              resource.method !== 'GET' &&
              resource.method !== 'DELETE' && (
                <JsonBody
                  payload={
                    request && request.body !== undefined
                      ? request.body
                      : JSON.stringify(
                          schemaExampleFor(resource.schema),
                          null,
                          2,
                        )
                  }
                />
              )}
          </code>
        </pre>
      </div>
      {resource.targetSchema && (
        <div className={s['snippet']}>
          <div className={s['snippet__title']}>
            HTTP Response
          </div>
          <pre className="language-text">
            <code>
              <HttpStatus
                status={`${(response && response.statusCode) ||
                  '200'} ${(response && response.statusText) || 'OK'}`}
              />
              <Headers>
                {response && response.headers
                  ? Object.entries(response.headers).map(([name, value]) => (
                      <Header name={name} value={value} />
                    ))
                  : defaultResponseHeaders()}
              </Headers>
              <JsonBody
                payload={
                  response && response.body !== undefined
                    ? response.body
                    : JSON.stringify(
                        schemaExampleFor(resource.targetSchema),
                        null,
                        2,
                      )
                }
              />
            </code>
          </pre>
        </div>
      )}
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
