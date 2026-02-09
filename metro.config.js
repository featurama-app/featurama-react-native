const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const sdkPath = path.resolve(__dirname, '../../sdks/react-native');

const config = getDefaultConfig(__dirname);

config.watchFolders = [sdkPath];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(sdkPath, 'node_modules'),
];

module.exports = config;
