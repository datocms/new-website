const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const path = require('path');
const redirects = require('./redirects');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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

module.exports = withNextEnv(
  withBundleAnalyzer({
    async redirects() {
      return [
        {
          source: '/landing-pages/cookieConsent.js',
          destination: '/api/cookieConsent',
          statusCode: 301,
        },
        ...redirects.map((r) => ({ ...r, statusCode: 301 })),
      ];
    },
    async headers() {
      return [
        {
          source: '/(.*)?', // Matches all pages
          headers: [
            {
              key: 'strict-transport-security',
              value: 'max-age=63072000; includeSubdomains; preload',
            },
            {
              key: 'x-content-type-options',
              value: 'nosniff',
            },
            {
              key: 'content-security-policy',
              value:
                'frame-ancestors https://datocms.admin.datocms.com https://cms.datocms.com http://localhost:3002 http://localhost:3000 https://plugins-cdn.datocms.com https://get.datocms.com',
            },
            {
              key: 'x-xss-protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
    experimental: {
      optimizeCss: {
        inlineFonts: true,
        preloadFonts: true,
        logLevel: 'error',
      },
    },
    images: {
      disableStaticImages: true,
    },
    webpack(config) {
      config.resolve.modules.push(path.resolve('./'));

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.jsx?$/,
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
        issuer: /\.jsx?$/,
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
  }),
);
