const { Sequelize } = require('sequelize');
const sequelize = require('../util/db');



module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_premium: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    total_expense: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    }
});

// module.exports = class Users{
//     constructor(username, email, password, is_premium, total_expense){
//         this.username=username;
//         this.email=email;
//         this.password=password;
//         this.is_premium = is_premium;
//         this.total_expense = total_expense;
//     }

//     save(){
//         return db.execute(`INSERT INTO users(username,email,password,is_premium) VALUES(?,?,?,?)`,[this.username, this.email, this.password, this.is_premium]);
//     }

//     static updateIsPremium(userId){
//         return db.execute('UPDATE users SET is_premium=1 WHERE id = ?',[userId]);
//     }

//     static findUserByEmail(email){
//         return db.execute(`SELECT * FROM users WHERE email="${email}"`);
//     }

//     static findUserById(id){
//         return db.execute(`SELECT * FROM users WHERE id="${id}"`);
//     }

//     static getTotalEpensesDesc(){
//         return db.execute('SELECT username, total_expense FROM users ORDER BY total_expense DESC');
//     }

//     static updateTotalExpense(amount, userId){
//         return db.execute('UPDATE users SET total_expense=total_expense+? WHERE id=?',[amount, userId])
//     }

// };