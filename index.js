'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const env = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT || 5000;
const config = require('./config.js')[env];
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);

// Installs / Updates the Bot
bdk.installOrUpdateBot(packageJSON);

app.use(express.static('web/dist'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/web/dist/index.html');
});

http.Server(app).listen(PORT, () => {
  console.log('listening on: ', PORT);
});