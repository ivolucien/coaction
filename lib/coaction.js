'use strict'

const Log = require('./log')
let log = Log.get()

// Class manages clients and does not implement client behavior
class CoAction {
  constructor (initialClients = {}, options = {}) {
    if (options.logger) {
      Log.set(options.logger)
      log = Log.get()
    }
    log.trace('CoAction constructor: called', {
      clientNames: Object.keys(initialClients),
      options: Object.keys(options)
    })
    if (!initialClients || typeof initialClients !== 'object') {
      throw Error('Must pass in an object map of clients; Example { master: dbConnection, ... }')
    }
    this._clients = initialClients
    this.names.forEach((name) => {
      log.debug('CoAction constructor', { addingClientName: name })
      if (this[name] !== undefined) {
        throw Error(`Conflict! CoAction property exists, cannot use client named "${name}"`)
      }
      this._defineClientGetterOnThis(name)
    })
    log.trace('CoAction constructor: done', {
      clientNames: this.names,
      options: Object.keys(options)
    })
  }

  get names () { return Object.keys(this._clients) }

  get clients () { return this._clients }

  get size () { return this.names.length }

  // adds a getter to the base object for each client name
  // example: coaction.masterDb.select(...)
  _defineClientGetterOnThis (name) {
    Object.defineProperty(this, name, {
      get: () => this._clients[name],
      enumerable: true
    })
  }

  // @todo? consider alternative handling options when the property isn't a function
  _callAll (method) {
    const clientPromises = this.names.map((name) => {
      log.debug('CoAction ' + method, { clientName: name })
      const isFunction = typeof this[name][method] === 'function'
      return isFunction ? this[name][method]() : Promise.resolve(undefined)
    })
    return Promise.all(clientPromises)
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
