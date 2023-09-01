const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/validation')();
require('./startup/middlewares')(app, winston);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Listening at port ${port}`));

module.exports = server;
