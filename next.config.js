const withCSS = require("@zeit/next-css");
const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

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
      include: [path.resolve('./public/images')],
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: false,
            template: svgTemplate,
          }
        }
      ]
    });

    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve('./public/icons')],
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            template: svgTemplate,
          }
        }
      ]
    });

    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/, 
      })
    );
    return config;
  }
});

ignoreOrder: false