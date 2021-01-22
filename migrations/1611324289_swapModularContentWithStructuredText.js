'use strict';

async function swap(client, modelApiKey, fieldApiKey) {
  const oldField = await client.fields.find(`${modelApiKey}::${fieldApiKey}`);
  const newField = await client.fields.find(
    `${modelApiKey}::structured_text_${fieldApiKey}`,
  );

  await client.fields.update(oldField.id, {
    apiKey: `legacy_${fieldApiKey}`,
    label: `Legacy ${oldField.label}`,
  });
  await client.fields.update(newField.id, {
    apiKey: fieldApiKey,
    label: oldField.label,
  });
}

module.exports = async (client) => {
  await swap(client, 'blog_post', 'content');
  await swap(client, 'blog_post', 'excerpt');
  await swap(client, 'doc_page', 'content');
  await swap(client, 'success_story', 'content');
  await swap(client, 'changelog_entry', 'content');
};
