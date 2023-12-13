const { Sequelize } = require('sequelize');
const sequelize = require('../util/db');

module.exports = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    payment_id: {
        type: Sequelize.STRING,
        allowNull:true
    },
    order_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PENDING"
    }
});

// module.exports = class Orders{
//     constructor(order_id, payment_id, order_status, user_id){
//         this.order_id=order_id;
//         this.order_status=order_status;
//         this.user_id = user_id;
//         this.payment_id=payment_id;
//     }

//     save(){
//         return db.execute(`INSERT INTO orders(order_id, order_status, user_id) VALUES(?,?,?)`,[this.order_id, this.order_status, this.user_id]);
//     }

//     updateOrderPayment(){
//         return db.execute(`UPDATE orders SET payment_id=?, order_status=? WHERE order_id=? AND user_id=?`,[this.payment_id, this.order_status, this.order_id, this.user_id]);
//     }

//     static findUserByEmail(email){
//         return db.execute(`SELECT * FROM users WHERE email="${email}"`);
//     }

//     static findUserById(id){
//         return db.execute(`SELECT * FROM users WHERE id="${id}"`);
//     }
// };