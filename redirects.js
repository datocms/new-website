module.exports = [
  {
    source: '/:path+/',
    destination: '/:path+',
  },
  {
    source: '/marketplace/plugins/i/datocms-plugin-yoast-seo',
    destination:
      '/marketplace/plugins/i/datocms-plugin-seo-readability-analysis',
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
    destination: '/team/best-cms-for-developers',
  },
  {
    source: '/docs/building-plugins/:rest*',
    destination: '/docs/legacy-plugins/:rest*',
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
    destination: '/security',
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
  {
    source: '/cms/react',
    destination: '/cms/react-cms',
  },
  {
    source: '/cms/hugo',
    destination: '/cms/hugo-cms',
  },
  {
    source: '/cms/nextjs',
    destination: '/cms/nextjs-cms',
  },
  {
    source: '/cms/nuxt-js',
    destination: '/cms/nuxtjs-cms',
  },
  {
    source: '/cms/jekyll',
    destination: '/cms/jekyll-cms',
  },
  {
    source: '/cms/middleman',
    destination: '/cms/middleman-cms',
  },
  {
    source: '/cms/vue',
    destination: '/cms/vue-js-cms',
  },
  {
    source: '/cms/gatsbyjs',
    destination: '/cms/gatsbyjs-cms',
  },
  {
    source: '/features/video-streaming-encoding',
    destination: '/features/video-api',
  },
  {
    source: '/features/graphql-content-api',
    destination: '/features/headless-cms-graphql',
  },
  {
    source: '/features/multi-language',
    destination: '/features/headless-cms-multi-language',
  },
  {
    source: '/features/workflows',
    destination: '/features/workflow-cms',
  },
  {
    source: '/features/real-time',
    destination: '/features/real-time-api',
  },
  {
    source: '/features/structured-text',
    destination: '/features/structured-content-cms',
  },
  {
    source: '/team/digital-marketers',
    destination: '/team/cms-digital-marketing',
  },
  {
    source: '/blog/what-is-an-headless-cms',
    destination: '/blog/what-is-a-headless-cms',
  },
  {
    source: '/team/developers',
    destination: '/team/best-cms-for-developers',
  },
  {
    source: '/enterprise',
    destination: '/enterprise-headless-cms',
  },
  {
    source: '/marketplace/starters/nextjs-blog',
    destination: '/marketplace/starters/nextjs-template-blog',
  },
  {
    source: '/blog/offer-responsive-progressive-lqip-images-in-2020',
    destination: '/blog/best-way-for-handling-react-images',
  },
  {
    source: '/blog/static-ecommerce-website-snipcart-gatsbyjs-datocms',
    destination: '/blog/gatsby-ecommerce-tutorial',
  },
  {
    source: '/cms/gatsbyjs-cms',
    destination: '/cms/gatsby-cms',
  },
  {
    source: '/landing/jamstackconf-2022',
    destination: '/?ref=jamstackconf-2022',
  },
  {
    source: '/landing/nextjsconf-2022',
    destination: '/',
  },
  {
    source: '/legal/security',
    destination: '/security',
  },
  {
    source: '/legal/privacy',
    destination: '/legal/privacy-policy',
  },
  {
    source: '/docs/pro-tips/manage-draft-published-state-by-locale',
    destination: '/docs/general-concepts/localization#locale-based-publishing',
  },
  {
    source:
      '/marketplace/starters/next-js-multilingual-blog-per-local-publishing',
    destination: '/docs/general-concepts/localization#locale-based-publishing',
  },
  {
    source: '/pricing/compare',
    destination: '/pricing',
  },
  {
    source: '/docs/content-management-api/rate-limits',
    destination: '/docs/content-management-api/technical-limits',
  },
  {
    source: '/docs/content-delivery-api/rate-limiting',
    destination: '/docs/content-delivery-api/technical-limits',
  },
  {
    source: '/partners/locale',
    destination: '/tech-partners/locale',
  },
  {
    source: '/partners/locale',
    destination: '/tech-partners/crowdin',
  },
  {
    source: '/partners/imgix',
    destination: '/tech-partners/imgix',
  },
  {
    source:
      '/blog/introducing-visual-editing-for-vercel-and-datocms-enterprise-customers',
    destination:
      '/blog/introducing-content-link-for-vercel-and-datocms-enterprise-customers',
  },
  {
    source: '/blog/july-update-visual-editing-and-per-locale-publishing',
    destination: '/blog/july-update-content-link-and-per-locale-publishing',
  },
  {
    source: '/docs/visual-editing',
    destination: '/docs/content-link/how-to-use-content-link',
  },
  {
    source: '/docs/visual-editing/how-to-use-visual-editing',
    destination: '/docs/content-link/how-to-use-content-link',
  },
  {
    source: '/partners/harvey-cameron/showcase/jacuzzi ',
    destination: '/partners',
  },
  {
    source: '/docs/plugins/install', //Better Title
    destination: '/docs/general-concepts/plugins',
  },
  {
    source: '/blog/live-preview-changes-on-gatsby-preview',
    destination: '/blog',
  },
  {
    source: '/docs/hugo/localization',
    destination: '/docs/other-ssgs/localization',
  },
  {
    source: '/docs/localizing-images',
    destination: '/docs/content-delivery-api/images-and-videos',
  },
  {
    source: '/cda-explorer',
    destination: '/docs/content-delivery-api',
  },
  {
    source: '/docs/metalsmith',
    destination: '/docs/other-ssgs',
  },
  {
    source: '/docs/middleman/image-manipulation',
    destination: '/docs/other-ssgs/image-manipulation',
  },
  {
    source: '/docs/content-management-api/using-the-ruby-client',
    destination: '/docs/content-management-api',
  },
  {
    source: '/use-cases',
    destination: '/',
  },
  {
    source: '/docs/cdn-settings/advanced-asset-settings',
    destination: '/docs/asset-api/asset-cdn-settings',
  },
  {
    source: '/docs/general-concepts/videos',
    destination: '/docs/asset-api/videos',
  },
  {
    source: '/docs/general-concepts/images',
    destination: '/docs/asset-api/images',
  },
  {
    source: '/docs/project-starters-and-templates',
    destination: '/docs/general-concepts/project-starters-and-templates',
  },
  {
    source: '/docs/project-starters-and-templates/clone-project-button',
    destination:
      '/docs/general-concepts/project-starters-and-templates#generate-a-clone-project-button',
  },
  {
    source: '/docs/project-starters-and-templates/project-starter-button',
    destination:
      '/docs/general-concepts/project-starters-and-templates#generate-a-project-starter-button',
  },
  {
    source: '/blog/headless-cms-unconventional-use-cases',
    destination: '/customer-stories/trip-to-japan',
  },
  {
    source: '/security',
    destination: '/legal/security',
  },
];
