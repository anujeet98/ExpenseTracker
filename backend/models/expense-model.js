const db = require('../util/db.js');

module.exports = class Expenses{
    constructor(amount, description, category, user_id){
        this.amount=amount;
        this.description =description;
        this.category=category;
        this.user_id=user_id;
    };

    save(){
        return db.execute('INSERT INTO expenses(amount,description,category,user_id) VALUES(?,?,?,?)', [this.amount,this.description,this.category,this.user_id]);
    }

    update(id){
        return db.execute('UPDATE expenses set amount=?, description=?, category=? WHERE id=?', [this.amount,this.description,this.category,id]);
    }

    static fetchAll(userId){
        return db.execute('SELECT id, amount, description, category FROM expenses WHERE user_id=?',[userId]);
    }

    static deleteExpense(expenseId, userId){
        return db.execute('DELETE FROM expenses WHERE id=? and user_id=?',[expenseId, userId]);
    }

    static fetchById(id, userId){
        return db.execute('SELECT id, amount, description, category FROM expenses WHERE id=? and user_id=?',[id, userId]);
    }
}