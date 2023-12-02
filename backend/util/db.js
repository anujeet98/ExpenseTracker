const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'bookingapp',
    password: 'rootoor'
});

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('')


module.exports = pool.promise();