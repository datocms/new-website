export function generateUrl(router, url, additionalParams = {}) {
  const params = new URLSearchParams(router.asPath.split('?')[1]);
  Object.entries(additionalParams).forEach(([k, v]) => {
    params.set(k, v);
  });
  if (params.toString()) {
    return `${url}?${params.toString()}`;
  }
  return url;
}
