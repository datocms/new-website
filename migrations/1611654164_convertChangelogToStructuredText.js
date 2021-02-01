'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const getAllRecords = require('./utils/getAllRecords');
const { buildModularBlock } = require('datocms-client');
const path = require('path');
const {
  paragraph,
} = require('datocms-html-to-structured-text/dist/lib/handlers');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);
  const imageBlockId = itemTypesByApiKey['image'].id;

  await createStructuredTextFieldFrom(client, 'changelog_entry', 'content', [
    imageBlockId,
  ]);

  const records = await getAllRecords(client, 'changelog_entry');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const structuredTextValue = await markdownToStructuredText(record.content, {
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
            console.log(
              'Upload not found in Media Area, creating ex-novo!',
              url,
            );
            const uploadPath = await client.createUploadPath(url);
            upload = await client.uploads.create({ path: uploadPath });
          }

          return createNode('block', {
            item: buildModularBlock({
              image: {
                uploadId: upload.id,
              },
              itemType: imageBlockId,
            }),
          });
        },
      },
    });

    await client.items.update(record.id, {
      structuredTextContent: structuredTextValue,
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'changelog_entry', 'content');
};
