'use strict'

// Class manages clients and does not implement client behavior
class CoAction {
  constructor (initialClients = {}) {
    if (!initialClients || typeof initialClients !== 'object') {
      throw Error('Constructor argument must be an object map of clients; Example { master: dbConnection }')
    }
    this._clients = initialClients
    this.names.forEach((name) => {
      if (this[name] !== undefined) {
        throw Error(`Conflict! Cannot construct a ${typeof this} with a client named "${name}"`)
      }
      this._defineClientGetterOnThis(name)
    })
  }

  get names () { return Object.keys(this._clients) }

  get clients () { return this._clients }

  get size () { return this.names.length }

  // adds a getter to the object by client name
  // example: coaction.masterDb.select(...)
  _defineClientGetterOnThis (name) {
    Object.defineProperty(this, name, {
      get: () => this._clients[name],
      enumerable: true
    })
  }

  _callAll (method) {
    const clientPromises = this.names.map((name) => this[name][method]())
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
