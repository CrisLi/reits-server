const winston = require('winston');
const FileLogger = require('winston-daily-rotate-file');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const dir = path.join(process.cwd(), 'logs');
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const timestamp = () => moment().format();

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      timestamp,
      json: false,
      colorize: true
    }),
    new FileLogger({
      level,
      timestamp,
      filename: path.join(dir, 'reits.'),
      datePattern: 'yyyy-MM-dd.log',
      json: true,
      colorize: false
    })
  ]
});
