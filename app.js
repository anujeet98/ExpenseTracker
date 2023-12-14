require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');
const {Sequelize} = require('sequelize');

const sequelize = require('./util/db');
const User = require('./models/user-model');
const Order = require('./models/order-model');
const Expense = require('./models/expense-model');
const ForgetPassword = require('./models/forget-password');

const expenseRoutes = require('./routes/expense-route');
const userRoutes = require('./routes/user-route');
const purchaseRoutes = require('./routes/purchase-route');
const premiumRoutes = require('./routes/premium-route');
const passwordRoutes = require('./routes/password-route');

//---------------------------------------------------------------

const app = express();

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));
app.use(express.static('public'));

//--------------------------------------------------------------

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);

//-------------------------------------------------------------

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);


//-------------------------------------------------------------

const serverSync = async() => {
    try{
        await sequelize.sync
        // await sequelize.sync({force:true});
        app.listen(process.env.APP_PORT);
        console.log(`Server is running on PORT: ${process.env.APP_PORT}`);
    }
    catch(err){
        console.error(err);
    }
}

serverSync();


