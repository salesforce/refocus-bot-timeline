/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * config.js
 * Config file for different deployments - dev, staging, production
 */

// user is a global object provided by the Refocus server
/* eslint no-process-env: 0 */
const DEFAULT_PORT = 5000;
const botName = require('./package.json').name;
const readEnv = require('read-env').default;

const chatterOptions = process.env.CHATTER_OPTIONS || '';
const chatterOptionsArray = chatterOptions.split(',');
const chatterLoginDetails = [];

chatterOptionsArray.map((option) => {
  if (option) {
    chatterLoginDetails.push(readEnv(option));
  }
});

module.exports = {
  botName,
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || DEFAULT_PORT,
  dev: {
    refocusUrl: process.env.REFOCUS_URL_DEV || 'http://localhost:3000',
    token: process.env.API_TOKEN_DEV,
    refocusUsername: process.env.REFOCUS_USERNAME_DEV,
    refocusPassword: process.env.REFOCUS_PASSWORD_DEV,
    enableDropzone:
      process.env.ENABLE_DROPZONE_DEV &&
      process.env.ENABLE_DROPZONE_DEV === 'true',
    chatterLoginDetails,
    chatterOptionsArray,
  },
  sandbox: {
    refocusUrl: process.env.REFOCUS_URL_SANDBOX,
    token: process.env.API_TOKEN_SANDBOX,
    enableDropzone:
      process.env.ENABLE_DROPZONE_SANDBOX &&
      process.env.ENABLE_DROPZONE_SANDBOX === 'true',
    chatterLoginDetails,
    chatterOptionsArray,
  },
  production: {
    refocusUrl: process.env.REFOCUS_URL_PROD,
    token: process.env.API_TOKEN_PROD,
    enableDropzone:
      process.env.ENABLE_DROPZONE_PROD &&
      process.env.ENABLE_DROPZONE_PROD === 'true',
    chatterLoginDetails,
    chatterOptionsArray,
  },
  integrationSandbox: {
    refocusUrl: process.env.REFOCUS_INTEGRATION_SANDBOX_URL,
    token: process.env.API_TOKEN,
    refocusUsername: process.env.REFOCUS_USERNAME,
    refocusPassword: process.env.REFOCUS_PASSWORD,
    chatterOptionsArray,
    chatterLoginDetails,
  },
};
