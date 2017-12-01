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

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.jsx');
const bdk = require('../lib/refocus-bdk.js');
const botName = require('../package.json').name;

var ROOMID = window.location.pathname.split('rooms/').length > 1 ? parseInt(window.location.pathname.split(
  'rooms/')[1]) : 2; //This is a temperary fix
const roomId = parseInt(ROOMID); //ROOMID will be provided from the page DOM

document.body.addEventListener('init', init, false);
document.getElementById(botName).addEventListener('refocus.events', handleEvents, false);
document.getElementById(botName).addEventListener('refocus.room.settings', handleSettings, false);
document.getElementById(botName).addEventListener('refocus.bot.data', handleData, false);
document.getElementById(botName).addEventListener('refocus.bot.actions', handleActions, false);

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 * @return null
 */
function handleEvents(event) {
  console.log(botName + ' Event Activity', event);
  renderUI([event.detail]);
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 * @return null
 */
function handleSettings(room) {
  console.log(botName + ' Room Activity', room);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 * @return null
 */
function handleData(data) {
  console.log(botName + ' Bot Data Activity', data);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 * @return null
 */
function handleActions(action) {
  console.log(botName + ' Bot Action Activity', action);
}

/*
 * The actions to take before load.
 */
function init() {
  bdk.getEvents(roomId)
  .then((events) => {
    renderUI(events.body);
  });
}

/**
 * @global {Integer} roomId - Room Id that is provided from refocus
 * @return null
 */
function renderUI(response){
  ReactDOM.render(
    <App
      roomId={ roomId }
      response={ response }
    />,
    document.getElementById(botName)
  );
}