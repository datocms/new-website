module.exports = async function getAllRecords(client, modelApiKey) {
  const records = await client.items.all(
    {
      filter: { type: modelApiKey },
      nested: 'true',
    },
    { allPages: 30 },
  );

  console.log(`Found ${records.length} records!`);

  return records;
};
