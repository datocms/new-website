export default async function fetchCmaClientResources(jsonApiType, rel) {
  const response = await fetch(
    `https://cdn.jsdelivr.net/npm/@datocms/cma-client@latest/resources.json`,
  );
  const resources = await response.json();

  const foundResource = resources.find(
    (r) => r.jsonApiType === jsonApiType.replace(/\-/g, '_'),
  );

  if (!foundResource) {
    return null;
  }

  const foundEndpoint = foundResource.endpoints.find((e) => e.rel === rel);

  if (!foundEndpoint) {
    return null;
  }

  const { endpoints, ...resourceRest } = foundResource;

  return {
    ...resourceRest,
    endpoint: foundEndpoint,
  };
}
