const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const path = require('path');

dotenvLoad();

const withNextEnv = nextEnv();

const svgTemplate = (
  { template },
  opts,
  { imports, componentName, props, jsx },
) => {
  return template.ast`${imports}
    const ${componentName} = (${props}) => ${jsx};
    export default ${componentName};
  `;
};

module.exports = withNextEnv({
  experimental: {
    async redirects() {
      return [
        {
          source: '/docs/general-concepts/transfer',
          destination: '/docs/plans-pricing-and-billing/transfer',
          statusCode: 301,
        },
        {
          source: '/docs/content-management-api/js-client',
          destination: '/docs/content-management-api/using-the-nodejs-clients',
          statusCode: 301,
        },
        {
          source: '/docs/content-management-api/ruby-client',
          destination: '/docs/content-management-api/using-the-ruby-client',
          statusCode: 301,
        },
        {
          source: '/docs/security',
          destination: '/legal/security',
          statusCode: 301,
        },
        {
          source: '/docs/guides/private-videos',
          destination: '/docs/content-modelling/external-video-field',
          statusCode: 301,
        },
        {
          source: '/docs/deployments/custom-webhook',
          destination: '/docs/custom-build-methods',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/endpoint',
          destination: '/docs/content-delivery-api/api-endpoints',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/query_explorer',
          destination: '/docs/content-delivery-api/query-explorer',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/complexity_limiting',
          destination: '/docs/content-delivery-api/complexity',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/first-request',
          destination: '/docs/content-delivery-api/your-first-request',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/querying',
          destination: '/docs/content-delivery-api/how-to-fetch-records',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/filtering',
          destination: '/docs/content-delivery-api/filtering-records',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/ordering',
          destination: '/docs/content-delivery-api/ordering-records',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/modular-content',
          destination: '/docs/content-delivery-api/modular-content-fields',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/uploads',
          destination: '/docs/content-delivery-api/images-and-videos',
          statusCode: 301,
        },
        {
          source: '/docs/content-delivery-api/seo',
          destination: '/docs/content-delivery-api/seo-and-favicon',
          statusCode: 301,
        },
        {
          source: '/blog/2',
          destination: '/blog/p/2',
          statusCode: 301,
        },
        {
          source: '/changelog/2',
          destination: '/product-updates/p/2',
          statusCode: 301,
        },
        {
          source: '/changelog/3',
          destination: '/product-updates/p/3',
          statusCode: 301,
        },
        {
          source: '/changelog/4',
          destination: '/product-updates/p/4',
          statusCode: 301,
        },
        {
          source: '/changelog/5',
          destination: '/product-updates/p/5',
          statusCode: 301,
        },
        {
          source: '/changelog/6',
          destination: '/product-updates/p/5',
          statusCode: 301,
        },
        {
          source: '/changelog/:rest*',
          destination: '/product-updates/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/general-concepts/pricing',
          destination: '/docs/plans-pricing-and-billing',
          statusCode: 301,
        },
        {
          source: '/docs/guides/installing-site-search/:rest*',
          destination: '/docs/site-search/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/guides/:rest*',
          destination: '/docs/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/static-generators/gatsbyjs/:rest*',
          destination: '/docs/gatsby/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/static-generators/other-ssg/:rest*',
          destination: '/docs/other-ssgs/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/static-generators/:rest*',
          destination: '/docs/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/single-page-apps/:rest*',
          destination: '/docs/:rest*',
          statusCode: 301,
        },
        {
          source: '/docs/deployments/:rest*',
          destination: '/docs/:rest*',
          statusCode: 301,
        },
      ];
    },
  },
  webpack(config) {
    config.resolve.modules.push(path.resolve('./'));

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.jsx?$/,
      },
      include: [path.resolve('./public/images')],
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: false,
            template: svgTemplate,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.jsx?$/,
      },
      include: [path.resolve('./public/icons')],
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            template: svgTemplate,
          },
        },
      ],
    });

    return config;
  },
});
