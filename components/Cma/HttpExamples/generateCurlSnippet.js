function generateMethod(options) {
  const method = options.method?.toUpperCase() || 'GET';

  if (method === 'GET') return '';

  const type = {
    POST: '-X POST',
    PUT: '-X PUT',
    PATCH: '-X PATCH',
    DELETE: '-X DELETE',
    HEAD: '-X HEAD',
    OPTIONS: '-X OPTIONS',
  };

  return type[method];
}

function generateHeaders(options) {
  const { headers } = options;

  if (!headers) {
    return [];
  }

  return Object.entries(headers).map(
    ([name, value]) => `-H "${name}: ${`${value}`.replace(/(\\|")/g, '\\$1')}"`,
  );
}

export function escapeBody(body) {
  return body.replace(/'/g, `'\\''`);
}

function generateBody(options) {
  const { body } = options;

  if (!body) return null;

  if (typeof body === 'object') {
    return `--data-binary '${escapeBody(JSON.stringify(body))}'`;
  }

  return `--data-binary '${escapeBody(body)}'`;
}

export function generateCompress(isEncode) {
  return isEncode ? ' --compressed' : '';
}

export function generateCurlSnippet([url, options = {}]) {
  let lines = [];

  lines.push(`curl ${url}`);
  lines.push(generateMethod(options));
  lines = [...lines, ...generateHeaders(options)];
  lines.push(generateBody(options));

  return lines.filter(Boolean).join(' \\\n  ');
}
