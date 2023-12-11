const db = require('../util/db');

module.exports = class Users{
    constructor(username, email, password, is_premium, total_expense){
        this.username=username;
        this.email=email;
        this.password=password;
        this.is_premium = is_premium;
        this.total_expense = total_expense;
    }

    save(){
        return db.execute(`INSERT INTO users(username,email,password,is_premium) VALUES(?,?,?,?)`,[this.username, this.email, this.password, this.is_premium]);
    }

    static updateIsPremium(userId){
        return db.execute('UPDATE users SET is_premium=1 WHERE id = ?',[userId]);
    }

    static findUserByEmail(email){
        return db.execute(`SELECT * FROM users WHERE email="${email}"`);
    }

    static findUserById(id){
        return db.execute(`SELECT * FROM users WHERE id="${id}"`);
    }

    static getTotalEpensesDesc(){
        return db.execute('SELECT username, total_expense FROM users ORDER BY total_expense DESC');
    }

    static updateTotalExpense(amount, userId){
        return db.execute('UPDATE users SET total_expense=total_expense+? WHERE id=?',[amount, userId])
    }

};