'use strict'

class MockDb {
  constructor () {
    this.state = 'none' // 'transacting', 'committed', 'rolled_back'
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
    this.state = 'rolled_back'
    return Promise.resolve()
  }
}

module.exports = MockDb
