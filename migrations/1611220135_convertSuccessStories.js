const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');
const {
  withMark,
} = require('datocms-html-to-structured-text/dist/lib/handlers');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const contentField = await client.fields.find('success_story::content');

  await createStructuredTextFieldFrom(
    client,
    'success_story',
    'content',
    contentField.validators.richTextBlocks.itemTypes,
  );

  for (const fieldApiKey of ['result', 'challenge', 'title']) {
    await createStructuredTextFieldFrom(client, 'success_story', fieldApiKey);
  }

  await createStructuredTextFieldFrom(
    client,
    'success_story_result',
    'description',
  );

  const records = await getAllRecords(client, 'success_story');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const updatedFields = {
      structuredTextContent: await modularContentToStructuredText(
        record.content,
        itemTypesByApiKey,
      ),
      mainResults: await Promise.all(
        record.mainResults.map(async (block) => {
          return {
            ...block,
            attributes: {
              ...block.attributes,
              structuredTextDescription: await markdownToStructuredText(
                block.attributes.description,
              ),
            },
          };
        }),
      ),
    };

    for (const fieldApiKey of ['result', 'challenge', 'title']) {
      updatedFields[`structured_text_${fieldApiKey}`] =
        await markdownToStructuredText(record[fieldApiKey], {
          handlers: {
            strong: withMark('highlight'),
          },
        });
    }

    await client.items.update(record.id, updatedFields);

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  for (const fieldApiKey of ['result', 'challenge', 'title', 'content']) {
    await swapFields(client, 'success_story', fieldApiKey);
  }

  await swapFields(client, 'success_story_result', 'description');
};
