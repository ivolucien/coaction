'use strict'

const CoAction = require('../../lib/coaction')
const expect = require('chai').expect
const MockDb = require('../fixtures/db')
const log = require('../../lib/log')()

log.setLevel('debug')
// CoAction helps keep data in multiple data repositories synchronized
// This class just manages clients
describe('CoAction', function () {
  context('#constructor', function () {
    const db = new MockDb()
    const map = { mock: db }
    context('with no arguments', function () {
      it('should contain an empty list', function () {
        const co = new CoAction()
        expect(co).to.be.an('object')
        expect(co.size).to.equal(0, 'size')
      })
    })

    context('with a object-mapped clients argument', function () {
      it('should contain matching clients', function () {
        const co = new CoAction(map)
        expect(co).to.be.an('object')
        expect(co.size).to.equal(Object.keys(map).length, 'size')
        expect(co.clients).to.be.an('object', 'client map')
        expect(Object.keys(co.clients)[0]).to.equal(Object.keys(map)[0], JSON.stringify(map))
      })
    })

    context('with a client property in the clients argument', function () {
      it('supports access to the client by name', function () {
        const co = new CoAction(map)
        expect(co.clients.mock).to.be.an('object', 'db mock')
        expect(co.clients.mock.commit).to.be.a('function', 'db mock commit()')
      })
    })
  })

  // @todo: consolidate '#transaction', '#commit' and 'rollback' contexts into one loop?
  context('#transaction', function () {
    context('when initialized with a client', function () {
      const clients = { mockA: new MockDb() }
      it('should delegate to that client', async function () {
        const co = new CoAction(clients)
        expect(co).to.have.property('transaction')
        await co.transaction()
        expect(co.clients.mockA.state).to.equal('transacting')
      })
    })

    context('when initialized with multiple clients', function () {
      const clients = { mockA: new MockDb(), mockB: new MockDb() }
      it('should start a new transaction for all clients', async function () {
        const co = new CoAction(clients)
        await co.transaction()
        expect(co.clients.mockA.state).to.equal('transacting', 'mockA')
        expect(co.clients.mockB.state).to.equal('transacting', 'mockB')
      })
    })
  })

  context('#commit', function () {
    context('when initialized with a client', function () {
      const clients = { mockA: new MockDb() }
      it('should delegate to that client', async function () {
        const co = new CoAction(clients)
        expect(co).to.have.property('commit')
        await co.transaction()
        await co.commit()
        expect(co.clients.mockA.state).to.equal('committed')
      })
    })

    context('when initialized with multiple clients', function () {
      const clients = { mockA: new MockDb(), mockB: new MockDb() }
      it('should commit all clients', async function () {
        const co = new CoAction(clients)
        await co.transaction()
        await co.commit()
        expect(co.clients.mockA.state).to.equal('committed', 'mockA')
        expect(co.clients.mockB.state).to.equal('committed', 'mockB')
      })
    })
  })

  context('#rollback', function () {
    context('when initialized with a client', function () {
      const clients = { mockA: new MockDb() }
      it('should delegate to that client', async function () {
        const co = new CoAction(clients)
        expect(co).to.have.property('rollback')
        await co.transaction()
        await co.rollback()
        expect(co.clients.mockA.state).to.equal('rolled_back')
      })
    })

    context('when initialized with multiple clients', function () {
      const clients = { mockA: new MockDb(), mockB: new MockDb() }
      it('should rollback all clients', async function () {
        const co = new CoAction(clients)
        await co.transaction()
        await co.rollback()
        expect(co.clients.mockA.state).to.equal('rolled_back', 'mockA')
        expect(co.clients.mockB.state).to.equal('rolled_back', 'mockB')
      })
    })
  })
})
