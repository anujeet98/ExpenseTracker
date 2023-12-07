const db = require('../util/db');

module.exports = class Users{
    constructor(username, email, password){
        this.username=username;
        this.email=email;
        this.password=password;
    }

    save(){
        return db.execute(`INSERT INTO users(username,email,password) VALUES(?,?,?)`,[this.username, this.email, this.password]);
    }

    static findUserByEmail(email){
        return db.execute(`SELECT * FROM users WHERE email="${email}"`);
    }
};