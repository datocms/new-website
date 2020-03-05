// Adapted from:
// https://nextjs.org/docs/advanced-features/customizing-postcss-config#customizing-plugins

module.exports = {
  plugins: {
    // Customizations:
    'postcss-advanced-variables': {},
    'postcss-property-lookup': {},
    'postcss-nested': {},

    // Defaults:
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 2, // Customized from 3 to 2
      features: {
        'custom-properties': false,
      },
    },
  },
};
