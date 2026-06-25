const { getDefaultConfig } = require("expo/metro-config"); 

const defaultConfig = getDefaultConfig(__dirname); 

const svgConfig = { 
  transformer: { 
    babelTransformerPath: require.resolve("react-native-svg-transformer"), 
  }, 
  resolver: { 
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"), 
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"], 
  }, 
}; 

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    ...svgConfig.transformer,
  },
  resolver: {
    ...defaultConfig.resolver,
    ...svgConfig.resolver,
  },
};