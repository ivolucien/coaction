'use strict'

const CoAction = require('../../lib/coaction')
const expect = require('chai').expect
const Db = require('../fixtures/db')

describe('CoAction', function () {
  context('#constructor', function () {
    const db = new Db()
    const map = { mock: db }
    context('with no arguments', function () {
      it('should contain an empty list', function () {
        console.log('@todo: add proper logger support')
        const co = new CoAction()
        expect(co).to.be.an('object')
        expect(co.size).to.equal(0, 'size')
      })
    })

    context('with a object-mapped sources argument', function () {
      it('should contain matching sources', function () {
        const co = new CoAction(map)
        expect(co).to.be.an('object')
        expect(co.size).to.equal(Object.keys(map).length, 'size')
        expect(co.getSources()).to.include(db, 'mock db')
      })
    })

    context('with a client property in the sources argument', function () {
      it('supports access to the client by name', function () {
        const co = new CoAction(map)
        expect(co.sources.mock).to.be.an('object', 'db mock')
        expect(co.sources.mock.commit).to.be.a('function', 'db mock commit()')
      })
    })
  })

  // @todo: consolidate '#transaction', '#commit' and 'rollback' contexts into one loop?
  context('#transaction', function () {
    context('when initialized with a source client', function () {
      const sources = { mockA: new Db() }
      it('should delegate to that client', async function () {
        const co = new CoAction(sources)
        expect(co).to.have.property('transaction')
        await co.transaction()
        expect(co.sources.mockA.state).to.equal('transacting')
      })
    })

    context('when initialized with multiple source clients', function () {
      const sources = { mockA: new Db(), mockB: new Db() }
      it('should start a new transaction for all clients', async function () {
        const co = new CoAction(sources)
        await co.transaction()
        expect(co.sources.mockA.state).to.equal('transacting', 'mockA')
        expect(co.sources.mockB.state).to.equal('transacting', 'mockB')
      })
    })
  })

  context('#commit', function () {
    context('when initialized with a source client', function () {
      const sources = { mockA: new Db() }
      it('should delegate to that client', async function () {
        const co = new CoAction(sources)
        expect(co).to.have.property('commit')
        await co.transaction()
        await co.commit()
        expect(co.sources.mockA.state).to.equal('committed')
      })
    })

    context('when initialized with multiple source clients', function () {
      const sources = { mockA: new Db(), mockB: new Db() }
      it('should commit all clients', async function () {
        const co = new CoAction(sources)
        await co.transaction()
        await co.commit()
        expect(co.sources.mockA.state).to.equal('committed', 'mockA')
        expect(co.sources.mockB.state).to.equal('committed', 'mockB')
      })
    })
  })

  context('#rollback', function () {
    context('when initialized with a source client', function () {
      const sources = { mockA: new Db() }
      it('should delegate to that client', async function () {
        const co = new CoAction(sources)
        expect(co).to.have.property('rollback')
        await co.transaction()
        await co.rollback()
        expect(co.sources.mockA.state).to.equal('rolledback')
      })
    })

    context('when initialized with multiple source clients', function () {
      const sources = { mockA: new Db(), mockB: new Db() }
      it('should rollback all clients', async function () {
        const co = new CoAction(sources)
        await co.transaction()
        await co.rollback()
        expect(co.sources.mockA.state).to.equal('rolledback', 'mockA')
        expect(co.sources.mockB.state).to.equal('rolledback', 'mockB')
      })
    })
  })
})
