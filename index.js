/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

require('dotenv').config();

const env = require('./config.js').env;
const config = require('./config.js')[env];
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);


bdk.installOrUpdateBot(packageJSON);
