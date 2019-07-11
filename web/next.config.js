const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

const path = require('path');

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      // Important: return the modified config

      // Setup dotenv
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      // Set up alias for shared folder
      config.resolve.alias['shared'] = path.join(__dirname, '../shared');
      return config;
    },
    webpackDevMiddleware: config => {
      // Perform customizations to webpack dev middleware config
      // Important: return the modified config
      return config;
    }
  };