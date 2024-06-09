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

const {getDefaultConfig} = require('expo/metro-config');
const resolveFrom = require("resolve-from");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    // If the bundle is resolving "event-target-shim" from a module that is part of "react-native-webrtc".
    moduleName.startsWith("event-target-shim") &&
    context.originModulePath.includes("react-native-webrtc")
  ) {
    // Resolve event-target-shim relative to the react-native-webrtc package to use v6.
    // React Native requires v5 which is not compatible with react-native-webrtc.
    const eventTargetShimPath = resolveFrom(
      context.originModulePath,
      moduleName
    );

    return {
      filePath: eventTargetShimPath,
      type: "sourceFile",
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;