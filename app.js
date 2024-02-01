require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// const helmet = require('helmet');
// const https = require('https');
// const compression = require('compression');

// const User = require('./models/user-model');
// const Order = require('./models/order-model');
// const Expense = require('./models/expense-model');
// const ForgetPassword = require('./models/forget-password');
// const Download = require('./models/download-model');

// const expenseRoutes = require('./routes/expense-route');
// const userRoutes = require('./routes/user-route');
// const purchaseRoutes = require('./routes/purchase-route');
// const premiumRoutes = require('./routes/premium-route');
// const passwordRoutes = require('./routes/password-route');

//---------------------------------------------------------------

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    {flags: 'a'});

const app = express();
// app.use(helmet()); 
// app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'public')));

//--------------------------------------------------------------

// app.use('/user', userRoutes);
// app.use('/expense', expenseRoutes);
// app.use('/purchase', purchaseRoutes);
// app.use('/premium', premiumRoutes);
// app.use('/password', passwordRoutes);

// app.use((req,res) => {
//     res.sendFile(path.join(__dirname, `/views/${req.url}`));
// })


//-------------------------------------------------------------

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgetPassword);
// ForgetPassword.belongsTo(User);

// User.hasMany(Download);
// Download.belongsTo(User);


//-------------------------------------------------------------
//for self signed SSL certificate use
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const serverInit = async function (){
    try{
        const con = await mongoose.connect('mongodb+srv://anujeet98:Hk42VvtrhbulVyXP@cluster0.ijrpm3b.mongodb.net/expenseTracker?retryWrites=true&w=majority');
        // console.log(con);
        app.listen(process.env.APP_PORT || 3000);
        console.log(`Server is running on PORT: ${process.env.APP_PORT}`);
    }
    catch(err){
        console.error(err);
    }
};
serverInit();

