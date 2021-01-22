'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextField = require('./utils/createStructuredTextField');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const contentField = await client.fields.find('doc_page::content');

  await createStructuredTextField(
    client,
    'doc_page',
    'Content (structured-text)',
    'structured_text_content',
    contentField.validators.richTextBlocks.itemTypes,
  );

  const records = await getAllRecords(client, 'doc_page');

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
