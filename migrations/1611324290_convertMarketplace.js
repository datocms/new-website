'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextField = require('./utils/createStructuredTextField');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  for (let modelApiKey of ['hosting_app', 'enterprise_app']) {
    const contentField = await client.fields.find(`${modelApiKey}::content`);

    await createStructuredTextField(
      client,
      modelApiKey,
      'Content (structured-text)',
      'structured_text_content',
      contentField.validators.richTextBlocks.itemTypes,
    );

    const records = await getAllRecords(client, modelApiKey);

    for (const record of records) {
      console.log(`Record #${record.id}`);

      await client.items.update(record.id, {
        structuredTextContent: await modularContentToStructuredText(
          record.content,
          itemTypesByApiKey,
        ),
      });

      if (record.meta.status !== 'draft') {
        console.log('Republish!');
        await client.items.publish(record.id);
      }
    }

    await swapFields(client, modelApiKey, 'content');
  }
};
