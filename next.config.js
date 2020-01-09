const withCSS = require("@zeit/next-css");
const path = require('path');

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]_[hash:base64:5]"
  },
  webpack(config) {
    config.resolve.modules.push(path.resolve('./'));

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            template: (
              { template },
              opts,
              { imports, componentName, props, jsx }
            ) => {
              return template.ast`${imports}
                const ${componentName} = (${props}) => ${jsx};
                export default ${componentName};
              `;
            }
          }
        }
      ]
    });

    return config;
  }
});
