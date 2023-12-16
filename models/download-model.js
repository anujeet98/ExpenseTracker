const { Sequelize } = require('sequelize');
const sequelize = require('../util/db');


module.exports = sequelize.define('download',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    download_url:{
        type: Sequelize.STRING,
        allowNull: false
    }
});