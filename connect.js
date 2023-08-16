var mysql = require('mysql');

var conn = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Angelanh5@gmail.com',
	database: 'quanlykhoahoc',
	multipleStatements: true
});

module.exports = conn;