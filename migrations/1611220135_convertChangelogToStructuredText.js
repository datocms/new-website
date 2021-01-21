'use strict';

const { buildModularBlock } = require('datocms-client');
const unified = require('unified');
const path = require('path');
const parse = require('remark-parse');
const toHast = require('mdast-util-to-hast');
const inspect = require('unist-util-inspect');
const {
  paragraph,
} = require('datocms-html-to-structured-text/dist/lib/lib/handlers');
const { hastToDast } = require('datocms-html-to-structured-text');
const { validate } = require('datocms-structured-text-utils');

const IMAGE = 'image';

module.exports = async (client) => {
  const itemTypesByApiKey = (await client.itemTypes.all()).reduce(
    (acc, it) => ({ ...acc, [it.apiKey]: it }),
    {},
  );

  await client.fields.create('changelog_entry', {
    label: 'Structured text',
    apiKey: 'structured_text',
    fieldType: 'structured_text',
    validators: {
      structuredTextBlocks: {
        itemTypes: [itemTypesByApiKey[IMAGE].id],
      },
      structuredTextLinks: { itemTypes: [] },
    },
  });

  const articles = await client.items.all(
    {
      filter: { type: itemTypesByApiKey['changelog_entry'].id },
      nested: 'true',
    },
    { allPages: 30 },
  );

  console.log(`Found ${articles.length} entries!`);

  for (const article of articles) {
    console.log(article.id);
    const mdastTree = unified().use(parse).parse(article.content);
    const hastTree = toHast(mdastTree);
    const document = await hastToDast(hastTree, {
      handlers: {
        p: async (createNode, node, context) => {
          const imgNode = node.children.find(
            (n) => n.type === 'element' && n.tagName === 'img',
          );
          if (imgNode) {
            return context.handlers.img(createNode, imgNode, context);
          }
          return paragraph(createNode, node, context);
        },
        img: async (createNode, node, context) => {
          const { src: url } = node.properties;

          let upload;

          if (url.startsWith('https://www.datocms-assets.com')) {
            const pattern = path.basename(url).replace(/^[0-9]+\-/, '');

            const matchingUploads = await client.uploads.all({
              filter: {
                fields: {
                  filename: {
                    matches: {
                      pattern,
                      case_sensitive: false,
                      regexp: false,
                    },
                  },
                },
              },
            });

            upload = matchingUploads.find((u) => u.url === url);
          }

          if (!upload) {
            console.log('Upload non trovato! Lo creo!', article.id, url);
            const uploadPath = await client.createUploadPath(url);
            upload = await client.uploads.create({ path: uploadPath });
          }

          return createNode('block', {
            item: buildModularBlock({
              image: {
                uploadId: upload.id,
              },
              itemType: itemTypesByApiKey[IMAGE].id,
            }),
          });
        },
      },
    });

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

    await client.items.update(article.id, { structuredText: result });
  }
};
