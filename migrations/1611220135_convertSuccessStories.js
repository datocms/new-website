'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const contentField = await client.fields.find('success_story::content');

  await createStructuredTextFieldFrom(
    client,
    'success_story',
    'content',
    contentField.validators.richTextBlocks.itemTypes,
  );

  const records = await getAllRecords(client, 'success_story');

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

  await swapFields(client, 'success_story', 'content');
};
