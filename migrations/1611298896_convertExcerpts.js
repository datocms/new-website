'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const toHast = require('mdast-util-to-hast');
const inspect = require('unist-util-inspect');
const { hastToDast } = require('datocms-html-to-structured-text');
const { validate } = require('datocms-structured-text-utils');

module.exports = async (client) => {
  const itemTypesByApiKey = (await client.itemTypes.all()).reduce(
    (acc, it) => ({ ...acc, [it.apiKey]: it }),
    {},
  );

  await client.fields.create('blog_post', {
    label: 'Structured text excerpt',
    apiKey: 'structured_text_excerpt',
    fieldType: 'structured_text',
    validators: {
      structuredTextBlocks: {
        itemTypes: [],
      },
      structuredTextLinks: { itemTypes: [] },
    },
  });

  const articles = await client.items.all(
    {
      filter: { type: itemTypesByApiKey['blog_post'].id },
    },
    { allPages: true },
  );

  console.log(`Found ${articles.length} entries!`);

  for (const article of articles) {
    console.log(article.id);
    const mdastTree = unified().use(parse).parse(article.excerpt);
    const hastTree = toHast(mdastTree);
    const document = await hastToDast(hastTree);
    const validationResult = validate(document);

    if (!validationResult.valid) {
      console.log(validationResult.message);
      console.log(inspect(document));
      throw new Error('Foo!');
    }

    const result = {
      schema: 'dast',
      document,
    };

    await client.items.update(article.id, { structuredTextExcerpt: result });
  }
};
