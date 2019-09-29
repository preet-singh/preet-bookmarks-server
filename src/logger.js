const { NODE_ENV } = require('./config');
const winston = require('winston');
//NODE_ENV = will be production by default on heroku 
//winston - logs all code failures at different levels - for this we're looking @ info
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: 'info.log'
      })
    ]
  });
  if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

  module.exports = logger;