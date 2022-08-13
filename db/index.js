const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'node_app',
  password: 'deng2001',
  database: 'node_app',
})

module.exports = db
