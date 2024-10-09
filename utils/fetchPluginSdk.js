export async function fetchPluginSdkManifest() {
  const response = await fetch(
    'https://cdn.jsdelivr.net/npm/datocms-plugin-sdk/manifest.json',
  );
  return await response.json();
}
