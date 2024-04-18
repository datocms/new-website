import { stringify } from 'flatted';
import parser from 'json-schema-ref-parser';
import tiny from 'tiny-json-http';

export async function buildStructuredTextDocumentSchema() {
  const { body: unreferencedSchema } = await tiny.get({
    // url: 'http://site-api.lvh.me:3001/docs/dast-schema.json',
    url: 'https://site-api.datocms.com/docs/dast-schema.json',
  });

  const schema = await parser.dereference(unreferencedSchema);
  return stringify(schema);
}
