'use strict'

// @todo: move source related behavior here
class Sources {
  constructor (initialSources = {}) {
    if (!initialSources || typeof initialSources !== 'object') {
      throw Error('Constructor argument must be an object, example { master: dbClient }')
    }
    this.sources = initialSources
  }
}

module.exports = Sources
