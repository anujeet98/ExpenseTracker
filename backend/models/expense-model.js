const db = require('../util/db.js');

module.exports = class expense{
    constructor(amount, description, category, userId){
        this.amount=amount;
        this.description =description;
        this.category=category;
        this.userId=userId;
    };

    save(){
        return db.execute('INSERT INTO expense(amount,description,category,userId) VALUES(?,?,?,?)', [this.amount,this.description,this.category,this.userId]);
    }

    update(id){
        return db.execute('UPDATE expense set amount=?, description=?, category=? WHERE id=?', [this.amount,this.description,this.category,id]);
    }

    static fetchAll(userId){
        return db.execute('SELECT id, amount, description, category FROM expense WHERE userId=?',[userId]);
    }

    static deleteExpense(expenseId, userId){
        return db.execute('DELETE FROM expense WHERE id=? and userId=?',[expenseId, userId]);
    }

    static fetchById(id){
        return db.execute('SELECT * FROM expense WHERE id=?',[id]);
    }
}