const db = require('../Util/db.js');

module.exports = class expense{
    constructor(amount, description, category){
        this.amount=amount;
        this.description =description;
        this.category=category;
    };

    save(){
        return db.execute('INSERT INTO expense(amount,description,category) VALUES(?,?,?)', [this.amount,this.description,this.category]);
    }

    update(id){
        return db.execute('UPDATE expense set amount=?, description=?, category=? WHERE id=?', [this.amount,this.description,this.category,id]);
    }

    static fetchAll(){
        return db.execute('SELECT * FROM expense');
    }

    static deleteexpense(id){
        return db.execute('DELETE FROM expense WHERE id=?',[id]);
    }

    static fetchById(id){
        return db.execute('SELECT * FROM expense WHERE id=?',[id]);
    }
}