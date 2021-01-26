module.exports = async function swapFields(client, modelApiKey, fieldApiKey) {
  const oldField = await client.fields.find(`${modelApiKey}::${fieldApiKey}`);
  const newField = await client.fields.find(
    `${modelApiKey}::structured_text_${fieldApiKey}`,
  );

  // await client.fields.destroy(oldField.id);
  await client.fields.update(oldField.id, {
    apiKey: `legacy_${fieldApiKey}`,
    label: `Legacy ${oldField.label}`,
    position: 99,
  });
  await client.fields.update(newField.id, {
    apiKey: fieldApiKey,
    label: oldField.label,
    position: oldField.position,
  });
};
