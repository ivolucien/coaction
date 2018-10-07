const LogLevel = require('loglevel')

let logger = LogLevel // singleton for now

// simple wrapper for easy logger override
// @todo: consider using module 'debug' to control Coaction logging
function get () { return logger }

function set (aLogger = LogLevel) {
  if (aLogger == null || typeof aLogger !== 'object') {
    logger.debug('Logger parameter must be an object, returning default logger', {
      loggerArgType: typeof aLogger
    })
    return logger
  }
  logger = aLogger
  return logger
}

module.exports = { logger, get, set }
