'use strict'

class Db {
  constructor () {
    this.state = 'none' // 'committed', 'rolledback'
  }

  commit () {
    if (this.state === 'rolledback') {
      throw Error('Unsupported request for state: ' + this.state)
    }
    this.state = 'committed'
    return Promise.resolve()
  }

  rollback () {
    if (this.state === 'committed') {
      throw Error('Unsupported request for state:' + this.state)
    }
    this.state = 'rolledback'
    return Promise.resolve()
  }
}

module.exports = Db
