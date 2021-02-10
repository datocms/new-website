module.exports = [
  {
    source: '/:path+/',
    destination: '/:path+',
  },
  {
    source: '/docs/introduction/custom-assets-domain',
    destination: '/marketplace/enterprise/aws-s3',
  },
  {
    source: '/search',
    destination: '/docs/site-search',
  },
  {
    source: '/docs/search',
    destination: '/docs/site-search',
  },
  {
    source: '/about',
    destination: '/company/about',
  },
  {
    source: '/brand-assets',
    destination: '/company/brand-assets',
  },
  {
    source: '/features',
    destination: '/team/developers',
  },
  {
    source: '/docs/guides/custom-assets-domain/:rest*',
    destination: '/marketplace/enterprise/:rest*',
  },
  {
    source: '/docs/guides/single-sign-on',
    destination: '/marketplace/enterprise',
  },
  {
    source: '/docs/guides/single-sign-on/configure-sso-with-okta',
    destination: '/marketplace/enterprise/okta-sso',
  },
  {
    source: '/docs/guides/single-sign-on/configure-sso-with-onelogin',
    destination: '/marketplace/enterprise/onelogin-sso',
  },
  {
    source: '/docs/deployments/travis',
    destination: '/marketplace/hosting/travis-ci',
  },
  {
    source: '/docs/deployments/:rest*',
    destination: '/marketplace/hosting/:rest*',
  },
  {
    source: '/plugins/i/@stackbitdatocms-plugin-typed-list',
    destination: '/marketplace/plugins/i/@stackbit/datocms-plugin-typed-list',
  },
  {
    source: '/plugins/i/@ecologicdatocms-plugin-multiselect',
    destination: '/marketplace/plugins/i/@ecologic/datocms-plugin-multiselect',
  },
  {
    source: '/plugins/i/@ecologicdatocms-plugin-ordered-tag-editor',
    destination:
      '/marketplace/plugins/i/@ecologic/datocms-plugin-ordered-tag-editor',
  },
  {
    source: '/content-management-api',
    destination: '/docs/content-management-api',
  },
  {
    source: '/plugins',
    destination: '/marketplace/plugins',
  },
  {
    source: '/plugins/i/:rest*',
    destination: '/marketplace/plugins/i/:rest*',
  },
  {
    source: '/docs/plugins/entry-point',
    destination: '/docs/building-plugins/entry-point',
  },
  {
    source: '/docs/plugins/creating-a-new-plugin',
    destination: '/docs/building-plugins/creating-a-new-plugin',
  },
  {
    source: '/docs/plugins/publishing',
    destination: '/docs/building-plugins/publishing',
  },
  {
    source: '/docs/guides/offline-backups',
    destination: '/docs/import-and-export/export-data',
  },
  {
    source: '/docs/general-concepts/transfer',
    destination: '/docs/plans-pricing-and-billing/transfer',
  },
  {
    source: '/docs/content-management-api/js-client',
    destination: '/docs/content-management-api/using-the-nodejs-clients',
  },
  {
    source: '/docs/content-management-api/ruby-client',
    destination: '/docs/content-management-api/using-the-ruby-client',
  },
  {
    source: '/docs/security',
    destination: '/legal/security',
  },
  {
    source: '/docs/guides/private-videos',
    destination: '/docs/content-modelling/external-video-field',
  },
  {
    source: '/docs/deployments/custom-webhook',
    destination: '/docs/custom-build-methods',
  },
  {
    source: '/docs/content-delivery-api/overview',
    destination: '/docs/content-delivery-api',
  },
  {
    source: '/docs/content-delivery-api/endpoint',
    destination: '/docs/content-delivery-api/api-endpoints',
  },
  {
    source: '/docs/content-delivery-api/query_explorer',
    destination: '/docs/content-delivery-api/query-explorer',
  },
  {
    source: '/docs/content-delivery-api/complexity_limiting',
    destination: '/docs/content-delivery-api/complexity',
  },
  {
    source: '/docs/content-delivery-api/first-request',
    destination: '/docs/content-delivery-api/your-first-request',
  },
  {
    source: '/docs/content-delivery-api/querying',
    destination: '/docs/content-delivery-api/how-to-fetch-records',
  },
  {
    source: '/docs/content-delivery-api/filtering',
    destination: '/docs/content-delivery-api/filtering-records',
  },
  {
    source: '/docs/content-delivery-api/ordering',
    destination: '/docs/content-delivery-api/ordering-records',
  },
  {
    source: '/docs/content-delivery-api/modular-content',
    destination: '/docs/content-delivery-api/modular-content-fields',
  },
  {
    source: '/docs/content-delivery-api/uploads',
    destination: '/docs/content-delivery-api/images-and-videos',
  },
  {
    source: '/docs/content-delivery-api/seo',
    destination: '/docs/content-delivery-api/seo-and-favicon',
  },
  {
    source: '/blog/2',
    destination: '/blog/p/2',
  },
  {
    source: '/changelog/2',
    destination: '/product-updates/p/2',
  },
  {
    source: '/changelog/3',
    destination: '/product-updates/p/3',
  },
  {
    source: '/changelog/4',
    destination: '/product-updates/p/4',
  },
  {
    source: '/changelog/5',
    destination: '/product-updates/p/5',
  },
  {
    source: '/changelog/6',
    destination: '/product-updates/p/5',
  },
  {
    source: '/changelog/:rest*',
    destination: '/product-updates/:rest*',
  },
  {
    source: '/docs/general-concepts/pricing',
    destination: '/docs/plans-pricing-and-billing',
  },
  {
    source: '/docs/guides/installing-site-search/:rest*',
    destination: '/docs/site-search/:rest*',
  },
  {
    source: '/docs/guides/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/static-generators/gatsbyjs/:rest*',
    destination: '/docs/gatsby/:rest*',
  },
  {
    source: '/docs/static-generators/other-ssg/:rest*',
    destination: '/docs/other-ssgs/:rest*',
  },
  {
    source: '/docs/static-generators/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/single-page-apps/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/docs/deployments/:rest*',
    destination: '/docs/:rest*',
  },
  {
    source: '/plugins/field_editor/:rest*',
    destination: '/marketplace/plugins',
  },
  {
    source: '/plugins/field_addon/:rest*',
    destination: '/marketplace/plugins',
  },
  {
    source: '/marketplace/hosting/zeit',
    destination: '/marketplace/hosting/vercel',
  },
];
