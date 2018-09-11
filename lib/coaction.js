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

  _callAll (method) {
    const sourcePromises = this.getSources().map((source) => source[method]())
    return Promise.all(sourcePromises)
  }
  transaction () {
    return this._callAll('transaction')
  }

  commit () {
    return this._callAll('commit')
  }

  rollback () {
    return this._callAll('rollback')
  }
}

module.exports = CoAction
