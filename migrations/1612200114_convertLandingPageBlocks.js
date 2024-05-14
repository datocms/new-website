'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');
const {
  withMark,
} = require('datocms-html-to-structured-text/dist/lib/handlers');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const fieldsToConvert = [
    ['code_excerpt_block', 'content'],
    ['code_excerpt_block', 'title'],
    ['image_transformations_block', 'content'],
    ['image_transformations_block', 'title'],
    ['landing_cdn_map_block', 'description'],
    ['landing_cdn_map_block', 'title'],
    ['landing_progressive_images_block', 'content'],
    ['landing_progressive_images_block', 'title'],
    ['landing_video_block', 'content'],
    ['landing_video_block', 'title'],
    ['modular_blocks_block', 'content'],
    ['modular_blocks_block', 'title'],
    ['try_demo_block', 'content'],
    ['try_demo_block', 'title'],
  ];

  for (let [modelApiKey, fieldApiKey] of fieldsToConvert) {
    await createStructuredTextFieldFrom(client, modelApiKey, fieldApiKey);
  }

  const records = await getAllRecords(client, 'landing_page');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    await client.items.update(record.id, {
      content: await Promise.all(
        record.content.map(async (block) => {
          const itemTypeId = block.relationships.itemType.data.id;
          const itemTypeApiKey = Object.values(itemTypesByApiKey).find(
            (it) => it.id === itemTypeId,
          ).apiKey;
          const fieldApiKeys = fieldsToConvert
            .filter(([it]) => it === itemTypeApiKey)
            .map((entry) => entry[1]);

          const updatedAttrs = {};

          for (const field of fieldApiKeys) {
            updatedAttrs[
              `structured_text_${field}`
            ] = await markdownToStructuredText(
              block.attributes[field],
              field === 'title'
                ? {
                    handlers: {
                      strong: withMark('highlight'),
                    },
                  }
                : undefined,
            );
          }

          return {
            ...block,
            attributes: updatedAttrs,
          };
        }),
      ),
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  for (let [modelApiKey, fieldApiKey] of fieldsToConvert) {
    await swapFields(client, modelApiKey, fieldApiKey);
  }
};
