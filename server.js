const express = require('express');
const logger = require('morgan');
const app = require('./src/app');
const server = express();

server.use(logger('dev'));
server.use(express.static(__dirname + '/src/static'));

/**
  * GET /
  *
  */
server.get('/', app.showIndex);

/**
  * Starts the web application.
  *
  */
app.start(server);
