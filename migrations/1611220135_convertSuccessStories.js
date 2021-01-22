'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextField = require('./utils/createStructuredTextField');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const contentField = await client.fields.find('success_story::content');

  await createStructuredTextField(
    client,
    'success_story',
    'Content (structured-text)',
    'structured_text_content',
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
};
