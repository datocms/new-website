const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  for (const modelApiKey of ['hosting_app', 'enterprise_app']) {
    await createStructuredTextFieldFrom(client, modelApiKey, 'content');

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
