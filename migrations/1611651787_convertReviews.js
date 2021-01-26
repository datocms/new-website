'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextField = require('./utils/createStructuredTextField');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);
  const imageBlockId = itemTypesByApiKey['image'].id;

  await createStructuredTextField(
    client,
    'review',
    'Quote (structured-text)',
    'structured_text_quote',
    [imageBlockId],
  );

  const records = await getAllRecords(client, 'review');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const structuredTextValue = await markdownToStructuredText(record.quote);

    await client.items.update(record.id, {
      structuredTextQuote: structuredTextValue,
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'review', 'quote');
};
