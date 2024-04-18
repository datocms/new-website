const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  await createStructuredTextFieldFrom(client, 'blog_post', 'content');
  await createStructuredTextFieldFrom(client, 'blog_post', 'excerpt');

  for (const fieldApiKey of ['question', 'answer']) {
    await createStructuredTextFieldFrom(client, 'question_answer', fieldApiKey);
  }

  const records = await getAllRecords(client, 'blog_post');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    await client.items.update(record.id, {
      structuredTextContent: await modularContentToStructuredText(
        record.content,
        itemTypesByApiKey,
      ),
      structuredTextExcerpt: await markdownToStructuredText(record.excerpt),
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  for (const fieldApiKey of ['content', 'excerpt']) {
    await swapFields(client, 'blog_post', fieldApiKey);
  }

  for (const fieldApiKey of ['question', 'answer']) {
    await swapFields(client, 'question_answer', fieldApiKey);
  }
};
