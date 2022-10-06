const mysql = require('mysql2');
require("dotenv").config()

//connect to sql database
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
},
    console.log('Connected to the company database.')
);

module.exports = db;