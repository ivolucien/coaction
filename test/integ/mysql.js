'use strict'

const CoAction = require('../../lib/coaction')
const expect = require('chai').expect
const DbWrapper = require('../fixtures/mysql')

describe('CoAction integration #mysql', function () {
  let db
  let coact
  let dbResult

  beforeEach('db connection', async function () {
    db = new DbWrapper()
    await db.connect()
    coact = new CoAction({ first: db })
  })
  afterEach('teardown connection', async function () {
    await db.close()
  })

  it('constructor stores client', function () {
    expect(coact).to.be.an('object', 'constructor')
    expect(coact.names[0]).to.equal('first', 'name')
    expect(coact.first).to.equal(db, 'db connection')
  })

  it('starts a transaction', async function () {
    let result = await coact.transaction()
    expect(result).to.be.an('array', 'start trx result')
    dbResult = result[0][0]
    expect(dbResult.warningStatus).to.equal(0, 'no warnings')

    dbResult = await coact.first.inTransaction()
    expect(result).to.be.an('array', 'trx status result')
    expect(dbResult[0][0]['@@in_transaction']).to.equal(1, 'in transaction')
  })

  it('commits a transaction', async function () {
    await coact.transaction()
    let result = await coact.commit()
    expect(result).to.be.an('array', 'commit')
    dbResult = result[0][0]
    expect(dbResult.warningStatus).to.equal(0, 'no warnings')

    dbResult = await coact.first.inTransaction()
    expect(dbResult).to.be.an('array', 'trx status result')
    expect(dbResult[0][0]['@@in_transaction']).to.equal(0, 'not in transaction')
  })

  it('rolls back a transaction', async function () {
    await coact.transaction()
    let result = await coact.rollback()
    expect(result).to.be.an('array', 'rollback')
    dbResult = result[0][0]
    expect(dbResult.warningStatus).to.equal(0, 'no warnings')

    dbResult = await coact.first.inTransaction()
    expect(dbResult).to.be.an('array', 'trx status result')
    expect(dbResult[0][0]['@@in_transaction']).to.equal(0, 'not in transaction')
  })
})
