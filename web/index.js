/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * /web/index.js
 *
 * This code handles intial render of the bot and any rerenders triggered
 * from javascript events.
 */

require('../web/dist/public/styles/salesforce-lightning-design-system.css');

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
const App = require('./components/App.jsx');
const env = process.env.NODE_ENV || 'dev';
const config = require('../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);
const botName = require('../package.json').name;
const roomId = bdk.getRoomId();
const _user = {
  name: bdk.getUserName(),
  id: bdk.getUserName(),
  email: bdk.getUserEmail(),
};

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 */
function handleEvents(event) {
  console.log(botName + ' Event Activity', event);
  renderUI([event.detail], _user);
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 */
function handleSettings(room) {
  console.log(botName + ' Room Activity', room);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 */
function handleData(data) {
  console.log(botName + ' Bot Data Activity', data);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 */
function handleActions(action) {
  console.log(botName + ' Bot Action Activity', action);
}

/**
 * When the users leave/reloads the page, send an event to let log
 * the user leaving.
 */
function confirmExit(){
  const eventType = {
    'type': 'User',
    'user': _user,
    'join': false,
  };
  bdk.createEvents(
    roomId,
    _user.name + ' has left the room at ' +
      moment().format('YYYY-MM-DD HH:mm Z'),
    eventType
  );
}

/**
 * The actions to take before load.
 */
function init() {
  bdk.getEvents(roomId)
    .then((events) => {
      renderUI(events.body, _user);
      const eventType = {
        'type': 'User',
        'user': _user,
        'join': true,
      };
      bdk.createEvents(
        roomId,
        _user.name + ' has joined the room at ' +
          moment().format('YYYY-MM-DD HH:mm Z'),
        eventType
      );
    });
}

/**
 * This is the main function to render the UI
 *
 * {Integer} roomId - Room Id that is provided from refocus
 * {User} _user - The current user on page
 * @param {Event} response - Refocus events that are happening in this room
 */
function renderUI(response){
  ReactDOM.render(
    <App
      roomId={ roomId }
      response={ response }
      user={ _user }
    />,
    document.getElementById(botName)
  );
}

window.onbeforeunload = confirmExit;
document.getElementById(botName)
  .addEventListener('refocus.events', handleEvents, false);
document.getElementById(botName)
  .addEventListener('refocus.room.settings', handleSettings, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.data', handleData, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.actions', handleActions, false);

init();
