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

module.exports = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || DEFAULT_PORT,
  dev: {
    refocusUrl: process.env.REFOCUS_URL ||
      'http://localhost:3000',
    loginUrl: process.env.SFDC_URL,
    token: process.env.API_TOKEN,
    socketToken: process.env.SOCKET_TOKEN,
  },
  perf: {
    refocusUrl: process.env.REFOCUS_URL ||
      'http://refocus-rooms-perf.herokuapp.com',
    loginUrl: process.env.SFDC_URL,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbm5hbWUiOiJhYWEiLCJ1c2VybmFtZSI6ImFkbWluQHJlZm9jdXMuYWRtaW4iLCJ0aW1lc3RhbXAiOjE1NDM1Nzg5MTMxOTEsIlByb2ZpbGVOYW1lIjoiQWRtaW4iLCJJc0FkbWluIjp0cnVlLCJpYXQiOjE1NDM1Nzg5MTN9.dgIGO7UcK7TDLoKEC4h4jrt4QHNYQNNcIH0gGeMdaog',
    socketToken: process.env.SOCKET_TOKEN,
  },
  sandbox: {
    refocusUrl: process.env.REFOCUS_URL ||
      'https://refocus-sandbox.internal.salesforce.com',
    loginUrl: process.env.SFDC_URL,
    token: process.env.API_TOKEN,
    socketToken: process.env.SOCKET_TOKEN,
  },
  production: {
    refocusUrl: process.env.REFOCUS_URL ||
      'https://refocus.internal.salesforce.com',
    loginUrl: process.env.SFDC_URL,
    token: process.env.API_TOKEN,
    socketToken: process.env.SOCKET_TOKEN,
  },
};
