import tmp from 'tmp';
import tiny from 'tiny-json-http';
import fs from 'fs';
import util from 'util';
import { createGenerator } from 'ts-json-schema-generator';
import parser from 'json-schema-ref-parser';
import { stringify } from 'flatted';

const writeFile = util.promisify(fs.writeFile);

function tmpFile(opts = {}) {
  return new Promise((resolve, reject) => {
    tmp.file(opts, (err, path, fd, cleanupCallback) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        path,
        cleanupCallback,
      });
    });
  });
}

export async function buildStructuredTextDocumentSchema() {
  const url =
    'https://unpkg.com/datocms-structured-text-utils/dist/types/types.d.ts';

  let response;

  try {
    response = await tiny.get({ url });
  } catch (e) {
    if (e.statusCode === 302) {
      response = await tiny.get({
        url: `https://unpkg.com${e.raw.headers.location}`,
      });
    } else {
      throw e;
    }
  }

  const { body } = response;

  const { path, cleanupCallback } = await tmpFile({ postfix: '.ts' });
  await writeFile(path, body, 'utf-8');

  const config = {
    path,
    type: 'Root',
  };

  const unreferencedSchema = createGenerator(config).createSchema(config.type);

  cleanupCallback();

  delete unreferencedSchema.$ref;
  const schema = await parser.dereference(unreferencedSchema);

  return stringify(schema);
}
