const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (name === '@') {
        return path.resolve(__dirname, 'src');
      }
      return path.join(__dirname, 'node_modules', name);
    },
  }
);

module.exports = config;