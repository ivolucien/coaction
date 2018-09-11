'use strict'

class Db {
  constructor () {
    this.state = 'none' // 'transacting', 'committed', 'rolledback'
  }

  transaction () {
    if (this.state !== 'none') {
      throw Error('Unsupported request for state: ' + this.state)
    }
    this.state = 'transacting'
    return Promise.resolve()
  }

  commit () {
    if (this.state !== 'transacting') {
      throw Error('Unsupported request for state: ' + this.state)
    }
    this.state = 'committed'
    return Promise.resolve()
  }

  rollback () {
    if (this.state !== 'transacting') {
      throw Error('Unsupported request for state:' + this.state)
    }
    this.state = 'rolledback'
    return Promise.resolve()
  }
}

module.exports = Db
