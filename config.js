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

module.exports = {
  botName,
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || DEFAULT_PORT,
  dev: {
    refocusUrl: process.env.REFOCUS_DEV_URL ||
      'http://localhost:3000',
    token: process.env.API_TOKEN,
  },
  perf: {
    refocusUrl: process.env.REFOCUS_PERF_URL,
    token: process.env.API_TOKEN,
  },
  sandbox: {
    refocusUrl: process.env.REFOCUS_SANDBOX_URL,
    token: process.env.API_TOKEN,
  },
  production: {
    refocusUrl: process.env.REFOCUS_PROD_URL,
    token: process.env.API_TOKEN,
  },
  integrationSandbox: {
    refocusUrl: process.env.REFOCUS_INTEGRATION_SANDBOX_URL,
    token: process.env.API_TOKEN,
    refocusUsername: process.env.REFOCUS_USERNAME,
    refocusPassword: process.env.REFOCUS_PASSWORD,
  }
};
