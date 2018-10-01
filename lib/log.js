const loglevel = require('loglevel')

function log () {
  return loglevel // simple wrapper for easy logger change
}

module.exports = log
