/**
 * Copyright (c) 2018, salesforce.com, inc.
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

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./components/App.jsx');
const { env } = require('../config.js');
const config = require('../config.js')[env];
const botName = require('../package.json').name;
const bdk = require('@salesforce/refocus-bdk')(config, botName);
const roomId = bdk.getRoomId();
const _user = {
  name: bdk.getUserName(),
  id: bdk.getUserId(),
  email: bdk.getUserEmail(),
};

// Only these event types will be queried for from Timeline
const eventTypes = ['comment', 'event', 'user', 'attachment'];
const eventTypeRetrieved = {};
eventTypes.forEach((e) => {
  eventTypeRetrieved[e.toLowerCase()] = false;
});

/**
 * This is the main function to render the UI
 *
 * {Integer} roomId - Room Id that is provided from refocus
 * {User} _user - The current user on page
 * @param {Event} response - Refocus events that are happening in this room
 */
function renderUI(response) {
  /* eslint-disable no-use-before-define */
  ReactDOM.render(
    <App
      roomId={roomId}
      response={response}
      getEventsByType={getEventsByType}
      user={_user}
    />,
    document.getElementById(botName)
  );
}

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 */
function handleEvents(event) {
  bdk.log.info(botName + ' Event Activity', event);
  // We don't want to show slack  events in the Timeline
  if (event.detail.context.type !== 'slack') {
    renderUI([event.detail], _user);
  }
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 */
function handleSettings(room) {
  bdk.log.info(botName + ' Room Activity', room);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 */
function handleData(data) {
  bdk.log.info(botName + ' Bot Data Activity', data);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 */
function handleActions(action) {
  bdk.log.info(botName + ' Bot Action Activity', action);
}

/**
 * Gets all events that are of a specific type and renders UI with these events.
 *
 * @param {String} type - Type of Event to load.
 * @returns {Promise} - Resolves to getting Events required.
 */
function getEventsByType(type) {
  const promises = [];
  const typeFinished = [];

  // Even when a user presses all, just the defined event types
  // will be requested.
  if (type.toLowerCase() === 'all') {
    eventTypes.forEach((e) => {
      if (!eventTypeRetrieved[e.toLowerCase()]) {
        promises.push(bdk.getAllEvents(roomId, e));
        typeFinished.push(e);
      }
    });
  } else if (!eventTypeRetrieved[type.toLowerCase()]) {
    promises.push(bdk.getAllEvents(roomId, type));
    typeFinished.push(type);
  }

  return Promise.all(promises).then((res) => {
    /* eslint-disable prefer-spread */
    const events = [].concat.apply([], res);
    typeFinished.forEach((t) => {
      eventTypeRetrieved[t.toLowerCase()] = true;
    });

    renderUI(events, _user);
  });
}

/**
 * The actions to take before load.
 */
function init() {
  renderUI([], _user);

  const promises = [
    getEventsByType('comment'),
    getEventsByType('event')
  ];

  Promise.all(promises);
}

document.getElementById(botName)
  .addEventListener('refocus.events', handleEvents, false);
document.getElementById(botName)
  .addEventListener('refocus.room.settings', handleSettings, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.data', handleData, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.actions', handleActions, false);

init();
