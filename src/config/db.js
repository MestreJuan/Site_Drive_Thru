const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool
(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 30,
        queueLimit: 0
    }
);

module.exports = connection.promise();