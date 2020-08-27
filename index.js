/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

require('dotenv').config();
const http = require('http');
const express = require('express');
const { env, port } = require('./config.js');
const config = require('./config.js')[env];
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);
const salesforce = require('./salesforce');
const botName = packageJSON.name;

const app = express();
const { enableDropzone } = config;

bdk.installOrUpdateBot(packageJSON).then(() => {
  bdk.refocusConnect(app, null, botName);
});

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 */
function handleActions(action) {
  if (action.name === 'postAttachmentTimeline') {
    if (!enableDropzone) return;

    if (!action.response && action.isPending) {
      const id = action.id;
      const params = action.parameters;
      const getParamByName = (name) =>
        params.filter((param) => param.name === name)[0].value;

      const attachment64String = getParamByName('timelineBotAttachment');
      const attachmentName = getParamByName('fileName');
      const attachmentType = getParamByName('fileType');
      const userName = getParamByName('userName');
      const selectedChatter = getParamByName('selectedChatter');

      bdk.findRoom(action.roomId).then((data) => {
        const room = data.body;
        const caseId = room.externalId.toString();
        const attachment = {
          file: attachment64String,
          name: attachmentName,
          type: attachmentType,
        };
        salesforce.postAttachment(
          attachment,
          userName,
          caseId,
          id,
          selectedChatter
        );
      });
    }
  }
}

app.on('refocus.bot.actions', handleActions);
app.use(express.static('web/dist'));
app.get('/*', (req, res) => {
  // eslint-disable-next-line
  res.sendFile(__dirname + '/web/dist/index.html');
});

http.Server(app).listen(port, () => {
  bdk.log.info('listening on: ', port);
});
