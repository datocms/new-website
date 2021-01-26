'use strict';

const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  await swapFields(client, 'blog_post', 'content');
  await swapFields(client, 'blog_post', 'excerpt');
  await swapFields(client, 'doc_page', 'content');
  await swapFields(client, 'success_story', 'content');
  await swapFields(client, 'changelog_entry', 'content');
};
