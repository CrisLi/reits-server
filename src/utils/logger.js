const winston = require('winston');
const FileLogger = require('winston-daily-rotate-file');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const dir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: () => moment(),
      json: true,
      colorize: true
    }),
    new FileLogger({
      level: 'info',
      filename: path.join(dir, 'reist.'),
      datePattern: 'yyyy-MM-dd.log',
      timestamp: () => moment(),
      json: true,
      colorize: false
    })
  ]
});
