const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');
const {
  withMark,
} = require('datocms-html-to-structured-text/dist/lib/handlers');

module.exports = async (client) => {
  await createStructuredTextFieldFrom(client, 'landing_page', 'title');

  const records = await getAllRecords(client, 'landing_page');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const structuredTextValue = await markdownToStructuredText(record.title, {
      handlers: {
        strong: withMark('highlight'),
      },
    });

    await client.items.update(record.id, {
      structuredTextTitle: structuredTextValue,
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'landing_page', 'title');
};
