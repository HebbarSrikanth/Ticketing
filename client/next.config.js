module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300; //Check for changes every specified milli secs
    return config;
  },
};
