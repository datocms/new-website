export function generateUrl(url, additionalParams = {}) {
  const params = new URLSearchParams(
    typeof document === 'undefined' ? undefined : document.location.search,
  );
  Object.entries(additionalParams).forEach(([k, v]) => {
    params.set(k, v);
  });
  if (params.toString()) {
    return `${url}?${params.toString()}`;
  }
  return url;
}
