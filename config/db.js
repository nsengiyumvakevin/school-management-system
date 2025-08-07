// config/db.js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

module.exports = connection;
