'use strict'

const mysql = require('mysql2/promise')

const host = process.env.MYSQL_HOST || 'localhost'
const port = process.env.MYSQL_PORT || 3306
const database = process.env.MYSQL_DATABASE
const user = process.env.MYSQL_USER || 'root'
const password = process.env.MYSQL_PASSWORD || ''

class DbWrapper {
  constructor () {
    this.connection = undefined
  }
  async connect () {
    this.connection = await mysql.createConnection({
      host,
      port,
      database,
      user,
      password
    })
  }
  transaction () { return this.connection.beginTransaction() }
  inTransaction () { return this.connection.query('SELECT @@in_transaction LIMIT 1') }
  commit () { return this.connection.commit() }
  rollback () { return this.connection.rollback() }
  close () { return this.connection.close() }
}

module.exports = DbWrapper
