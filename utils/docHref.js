export default url =>
  url === '/docs/content-delivery-api/filtering-records'
    ? '/docs/content-delivery-api/filtering-records'
    : !url.startsWith('/docs/content-management-api')
    ? '/docs/[...chunks]'
    : url.startsWith('/docs/content-management-api/r/')
    ? '/docs/content-management-api/resources/[resource]'
    : url === '/docs/content-management-api'
    ? '/docs/content-management-api'
    : '/docs/content-management-api/[...chunks]';
