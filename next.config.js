const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

module.exports = {
    env: {
      GMAPS_KEY: process.env.GMAPS_KEY,
      SERVER_URL: process.env.SERVER_URL
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      // Important: return the modified config

      // Setup dotenv
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      return config;
    },
    webpackDevMiddleware: config => {
      // Perform customizations to webpack dev middleware config
      // Important: return the modified config
      return config;
    }
  };