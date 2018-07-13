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
  staging: {
    refocusUrl: process.env.REFOCUS_URL ||
      'http://refocus-staging.herokuapp.com',
    loginUrl: process.env.SFDC_URL,
    token: process.env.API_TOKEN,
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
