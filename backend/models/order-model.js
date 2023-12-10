const db = require('../util/db');

module.exports = class Orders{
    constructor(order_id, order_status, user_id){
        this.order_id=order_id;
        this.order_status=order_status;
        this.user_id = user_id;
    }

    save(){
        return db.execute(`INSERT INTO orders(order_id, order_status, user_id) VALUES(?,?,?)`,[this.order_id, this.order_status, this.user_id]);
    }

    static findUserByEmail(email){
        return db.execute(`SELECT * FROM users WHERE email="${email}"`);
    }

    static findUserById(id){
        return db.execute(`SELECT * FROM users WHERE id="${id}"`);
    }
};