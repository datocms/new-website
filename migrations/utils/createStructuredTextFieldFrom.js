module.exports = async function createStructuredTextFieldFrom(
  client,
  modelApiKey,
  fieldApiKey,
  validBlockIds,
) {
  const legacyField = await client.fields.find(
    `${modelApiKey}::${fieldApiKey}`,
  );

  const newApiKey = `structured_text_${fieldApiKey}`;
  const label = `${legacyField.label} (Structured-text)`;

  try {
    const existingField = await client.fields.find(
      `${modelApiKey}::${newApiKey}`,
    );
    console.log(`${modelApiKey}::${newApiKey} already exists!`);
    return existingField;
  } catch (error) {
    console.log(`Creating ${modelApiKey}::${newApiKey}`);
    return client.fields.create(modelApiKey, {
      label,
      apiKey: newApiKey,
      fieldType: 'structured_text',
      fieldset: legacyField.fieldset,
      validators: {
        structuredTextBlocks: {
          itemTypes:
            validBlockIds ||
            (legacyField.fieldType === 'rich_text'
              ? legacyField.validators.richTextBlocks.itemTypes
              : []),
        },
        structuredTextLinks: { itemTypes: [] },
      },
    });
  }
};
