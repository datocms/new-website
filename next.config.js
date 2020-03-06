const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const path = require('path');

dotenvLoad();

const withNextEnv = nextEnv();

const svgTemplate = (
  { template },
  opts,
  { imports, componentName, props, jsx }
) => {
  return template.ast`${imports}
    const ${componentName} = (${props}) => ${jsx};
    export default ${componentName};
  `;
};

module.exports = withNextEnv({
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
