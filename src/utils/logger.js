/**
 * Application logger which logs to the `console` as well as a file.
 */

const util = require('util');

const moment = require('moment');

const Storage = require('./storage.js');

function log (args, logFunc, level, tag) {
  var date = new Date();
  var message = util.format.apply(util, args);
  var logMessage = util.format('[%s @ %s] [%s] %s\n', level, moment(date).format('YYYY-MM-DD HH:mm:ss'), tag, message);

  logFunc(logMessage);
  Storage.append({fileName: 'moonrise.log', value: logMessage}, err => {
    if (err) {
      console.error('Failed to save log message.');
      console.error(err);
    }
  });
}

function Logger (tag) {
  this.tag = tag;
}

Logger.prototype.debug = function (/* arguments */) {
  log(arguments, console.debug.bind(console), 'DEBUG', this.tag);
};

Logger.prototype.info = function (/* arguments */) {
  log(arguments, console.info.bind(console), 'INFO', this.tag);
};

Logger.prototype.warn = function (/* arguments */) {
  log(arguments, console.warn.bind(console), 'WARN', this.tag);
};

Logger.prototype.error = function (/* arguments */) {
  log(arguments, console.error.bind(console), 'ERROR', this.tag);
};

function loggerFactory (tag) {
  return new Logger(tag);
}

module.exports = loggerFactory;
