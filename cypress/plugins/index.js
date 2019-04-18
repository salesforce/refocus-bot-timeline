/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint no-unused-vars: 0 */

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args.push("--disable-site-isolation-trials");
      return args;
    }
  });
};
