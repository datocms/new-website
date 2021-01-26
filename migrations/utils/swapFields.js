module.exports = async function swapFields(client, modelApiKey, fieldApiKey) {
  const oldField = await client.fields.find(`${modelApiKey}::${fieldApiKey}`);
  const newField = await client.fields.find(
    `${modelApiKey}::structured_text_${fieldApiKey}`,
  );

  await client.fields.update(newField.id, {
    apiKey: fieldApiKey,
    label: oldField.label,
    position: oldField.position,
  });

  await client.fields.destroy(oldField.id);
};
