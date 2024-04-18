const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  await createStructuredTextFieldFrom(client, 'tutorial', 'excerpt');
  const records = await getAllRecords(client, 'tutorial');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    await client.items.update(record.id, {
      structuredTextExcerpt: await markdownToStructuredText(record.excerpt),
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'tutorial', 'excerpt');
};
