// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// usar react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// quitar .svg de assets y agregarlo a sourceExts
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

module.exports = config;
