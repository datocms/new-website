'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');
const {
  withMark,
} = require('datocms-html-to-structured-text/dist/lib/lib/handlers');

module.exports = async (client) => {
  for (let fieldApiKey of ['result', 'challenge', 'title']) {
    await createStructuredTextFieldFrom(client, 'success_story', fieldApiKey);
  }

  const records = await getAllRecords(client, 'success_story');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const updatedFields = {};

    for (let fieldApiKey of ['result', 'challenge', 'title']) {
      updatedFields[
        `structured_text_${fieldApiKey}`
      ] = await markdownToStructuredText(record[fieldApiKey], {
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

  for (let fieldApiKey of ['result', 'challenge', 'title']) {
    await swapFields(client, 'success_story', fieldApiKey);
  }
};
