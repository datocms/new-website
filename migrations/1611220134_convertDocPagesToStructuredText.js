'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const toHast = require('mdast-util-to-hast');
const inspect = require('unist-util-inspect');
const { hastToDast } = require('datocms-html-to-structured-text');
const {
  rootNodeType,
  blockNodeType,
  codeNodeType,
  validate,
} = require('datocms-structured-text-utils');
const { range } = require('range');

const CODE_BLOCK = 'code_block';
const TEXT = 'text';

const mdToDast = async (text) => {
  const mdastTree = unified().use(parse).parse(text);
  const hastTree = toHast(mdastTree);
  return hastToDast(hastTree);
};

module.exports = async (client) => {
  const itemTypesByApiKey = (await client.itemTypes.all()).reduce(
    (acc, it) => ({ ...acc, [it.apiKey]: it }),
    {},
  );

  const contentField = await client.fields.find('doc_page::content');

  await client.fields.create('doc_page', {
    label: 'Structured text',
    apiKey: 'structured_text',
    fieldType: 'structured_text',
    validators: {
      structuredTextBlocks: {
        itemTypes: contentField.validators.richTextBlocks.itemTypes,
      },
      structuredTextLinks: { itemTypes: [] },
    },
  });

  const articles = await client.items.all(
    {
      filter: { type: itemTypesByApiKey['doc_page'].id },
      nested: 'true',
    },
    { allPages: 30 },
  );

  console.log(`Found ${articles.length} doc pages!`);

  for (const article of articles) {
    let children = [];
    console.log(`Doc page #${article.id}`);

    for (const block of article.content) {
      const { id, meta, ...sanitizedBlock } = block;
      const {
        createdAt,
        updatedAt,
        ...sanitizedAttributes
      } = sanitizedBlock.attributes;

      sanitizedBlock.attributes = sanitizedAttributes;

      switch (block.relationships.itemType.data.id) {
        case itemTypesByApiKey[TEXT].id: {
          const dastTree = await mdToDast(block.attributes.text);
          children = [...children, ...dastTree.children];
          break;
        }
        case itemTypesByApiKey[CODE_BLOCK].id: {
          const codeNode = {
            type: codeNodeType,
            language: block.attributes.language,
            code: block.attributes.code,
          };

          if (block.attributes.highlightLines) {
            codeNode.highlight = block.attributes.highlightLines
              .split(/\s*,\s*/)
              .map((str) => {
                const chunks = str.split(/\-/);
                if (chunks.length === 1) {
                  return parseInt(chunks[0]) - 1;
                }

                return range(parseInt(chunks[0]) - 1, parseInt(chunks[1]));
              })
              .flat();
          }

          children.push(codeNode);
          break;
        }
        default: {
          children.push({ type: blockNodeType, item: sanitizedBlock });
          break;
        }
      }
    }

    const dastTree = {
      type: rootNodeType,
      children,
    };

    const validationResult = validate(dastTree);

    if (!validationResult.valid) {
      console.log(validationResult.message);
      console.log(inspect(dastTree));
      throw new Error('Foo!');
    }

    const result = {
      schema: 'dast',
      document: dastTree,
    };

    await client.items.update(article.id, { structuredText: result });
  }
};
