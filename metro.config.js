// I have created this file 

// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// config.transformer.minifierPath = 'metro-minify-uglify';
// config.transformer.minifierConfig = {
//   // Options: https://github.com/mishoo/UglifyJS#compress-options
//   keep_classnames: true, // FIX typeorm
//   keep_fnames: true, // FIX typeorm
//   mangle: {
//     // toplevel: false,
//     keep_classnames: true, // FIX typeorm
//     keep_fnames: true, // FIX typeorm
//   },
//   output: {
//     ascii_only: true,
//     quote_style: 3,
//     wrap_iife: true,
//   },
//   sourceMap: {
//     includeSources: false,
//   },
//   toplevel: false,
//   compress: {
//     // reduce_funcs inlines single-use functions, which cause perf regressions.
//     reduce_funcs: false,
//   },
// };

// module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
...transformer,
babelTransformerPath: require.resolve("react-native-svg-transformer"),
}

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

module.exports = config;