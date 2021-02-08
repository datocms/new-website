import tiny from 'tiny-json-http';
import parser from 'json-schema-ref-parser';
import { stringify } from 'flatted';

export async function buildStructuredTextDocumentSchema() {
  const { body: unreferencedSchema } = await tiny.get({
    url: 'https://site-api.datocms.com/docs/dast-schema.json',
  });

  const schema = await parser.dereference(unreferencedSchema);
  return stringify(schema);
}
