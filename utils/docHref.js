export default url =>
  url === '/docs/p/content-delivery-api/filtering-records'
    ? '/docs/p/content-delivery-api/filtering-records'
    : !url.startsWith('/docs/p/content-management-api')
    ? '/docs/p/[...chunks]'
    : url.startsWith('/docs/p/content-management-api/r/')
    ? '/docs/p/content-management-api/r/[resource]'
    : '/docs/p/content-management-api/[chunk]';
