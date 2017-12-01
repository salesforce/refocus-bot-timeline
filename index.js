'use strict';

const express = require('express');
const app = express();
const http = require('http');
const env = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT || 8080;
const install = require('./lib/install.js');

app.use(express.static('web/dist'));
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/web/dist/index.html');
});

http.Server(app).listen(PORT, function(){
  console.log('listening on: ', PORT);
});
