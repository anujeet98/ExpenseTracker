const db = require('../util/db');

module.exports = class Users{
    constructor(username, email, password){
        this.username=username;
        this.email=email;
        this.password=password;
    }

    save(){
        this.is_premium = false;
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

};