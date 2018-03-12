require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const env = require('./config.js').env;
const PORT = require('./config.js').port;
const config = require('./config.js')[env];
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);

// Installs / Updates the Bot
bdk.installOrUpdateBot(packageJSON);

app.use(express.static('web/dist'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/web/dist/index.html'));
});

http.Server(app).listen(PORT, () => {
  bdk.log.info('listening on: ', PORT);
});
