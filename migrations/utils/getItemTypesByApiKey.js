module.exports = async function getItemTypesByApiKey(client) {
  return (await client.itemTypes.all()).reduce(
    (acc, it) => ({ ...acc, [it.apiKey]: it }),
    {},
  );
};
