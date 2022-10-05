const mysql = require('mysql2');

//connect to sql database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Wtf!apass2',
    database: 'election'
},
    console.log('Connected to the election database.')
);

module.exports = db;