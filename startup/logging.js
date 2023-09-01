const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
    })

    process.on('unhandledRejection', (ex) => {
        throw ex;
    })


    winston.add(new winston.transports.File({ filename: 'errorLog.log' }));
    winston.add(new winston.transports.Console());
    //winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/Vidly', level: 'info'}));
}