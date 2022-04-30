'use strict';

module.exports = require('faas-mini-app').handler({
  baseDir: __dirname,
  debug: false,
  cloudSDK: require('@tbmp/mp-cloud-node-sdk').cloud,
  // injector

});
