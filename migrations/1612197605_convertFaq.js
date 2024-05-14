'use strict';

const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  await createStructuredTextFieldFrom(client, 'faq', 'answer');

  const records = await getAllRecords(client, 'faq');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const structuredTextValue = await markdownToStructuredText(record.answer);

    await client.items.update(record.id, {
      structuredTextAnswer: structuredTextValue,
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'faq', 'answer');
};
