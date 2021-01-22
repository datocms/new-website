module.exports = async function createStructuredTextField(
  client,
  modelApiKey,
  label,
  apiKey,
  validBlockIds = [],
) {
  try {
    const existingField = await client.fields.find(`${modelApiKey}::${apiKey}`);
    console.log(`${apiKey} already exists!`);
    return existingField;
  } catch (error) {
    console.log(`Creating ${apiKey}`);
    return client.fields.create(modelApiKey, {
      label,
      apiKey,
      fieldType: 'structured_text',
      validators: {
        structuredTextBlocks: {
          itemTypes: validBlockIds,
        },
        structuredTextLinks: { itemTypes: [] },
      },
    });
  }
};
