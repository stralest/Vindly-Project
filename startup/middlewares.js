const helmet = require('helmet');
const morgan = require('morgan');

module.exports = function (app, winston) {
    app.use(helmet());

    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
    winston.info(process.env.NODE_ENV);
}