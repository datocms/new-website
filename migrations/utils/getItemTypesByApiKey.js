module.exports = async function getItemTypesByApiKey(client) {
  return Object.fromEntries(
    (await client.itemTypes.all()).map((it) => [it.apiKey, it]),
  );
};
