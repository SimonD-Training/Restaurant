const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const database = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PWORD,
    database: process.env.DB
});

module.exports = database;