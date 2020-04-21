export default (url) => {
  if (url === '/docs/content-delivery-api/filtering-records') {
    return '/docs/content-delivery-api/filtering-records';
  }

  if (!url.startsWith('/docs/content-management-api')) {
    return '/docs/[...chunks]';
  }

  if (url.startsWith('/docs/content-management-api/resources/')) {
    if (url.match(/resources\/[^\/]+$/)) {
      return '/docs/content-management-api/resources/[resource]';
    } else {
      return '/docs/content-management-api/resources/[resource]/[endpoint]';
    }
  }

  if (url === '/docs/content-management-api') {
    return '/docs/content-management-api';
  }

  return '/docs/content-management-api/[...chunks]';
};
