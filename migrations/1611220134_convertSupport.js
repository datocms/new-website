const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  await createStructuredTextFieldFrom(client, 'support_topic', 'description');

  const records = await getAllRecords(client, 'support_topic');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    await client.items.update(record.id, {
      structuredTextDescription: await markdownToStructuredText(
        record.description,
      ),
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'support_topic', 'description');
};
