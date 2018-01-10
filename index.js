'use strict';

const express = require('express');
const app = express();
const http = require('http');
const env = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT || 5000;
const config = require('./config.js')[env];
const { socketToken } = config;
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);

// Installs / Updates the Bot
bdk.installOrUpdateBot(packageJSON);

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 */
function handleEvents(event){
  console.log('Event Activity', event);
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 */
function handleSettings(room){
  console.log('Room Settings Activity', room.name);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 */
function handleData(data){
  console.log('Bot Data Activity', data.new ? data.new.name : data.name);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 */
function handleActions(action){
  console.log('Bot Action Activity',
    action.new ? action.new.name : action.name
  );
}

// Event Handling
bdk.refocusConnect(app, socketToken);
app.on('refocus.events', handleEvents);
app.on('refocus.bot.actions', handleActions);
app.on('refocus.bot.data', handleData);
app.on('refocus.room.settings', handleSettings);

app.use(express.static('web/dist'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/web/dist/index.html');
});

http.Server(app).listen(PORT, () => {
  console.log('listening on: ', PORT);
});