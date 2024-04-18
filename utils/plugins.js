export function generateUrl(url, additionalParams = {}) {
  const params = new URLSearchParams(
    typeof document === 'undefined' ? undefined : document.location.search,
  );
  for (const [k, v] of Object.entries(additionalParams)) {
    params.set(k, v);
  }
  if (params.toString()) {
    return `${url}?${params.toString()}`;
  }
  return url;
}
