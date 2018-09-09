'use strict'

class CoAction {
  constructor (initialSources = {}) {
    if (!initialSources || typeof initialSources !== 'object') {
      throw Error('Constructor argument must be an object, example { master: dbClient }')
    }
    this.sources = initialSources
  }

  getNames () {
    return Object.keys(this.sources)
  }

  getSources () {
    return Object.keys(this.sources).map((key) => this.sources[key])
  }

  get size () {
    return Object.keys(this.sources).length
  }

  commit () {
    this.getSources().map((source) => source.commit())
  }

  rollback () {
    this.getSources().map((source) => source.rollback())
  }
}

module.exports = CoAction
