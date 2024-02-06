require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// const helmet = require('helmet');
// const https = require('https');
// const compression = require('compression');

const expenseRoutes = require('./routes/expense-route');
const userRoutes = require('./routes/user-route');
const purchaseRoutes = require('./routes/purchase-route');
const premiumRoutes = require('./routes/premium-route');
const passwordRoutes = require('./routes/password-route');

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
app.use(express.json({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'public')));

//--------------------------------------------------------------

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);

app.use((req,res) => {
    console.log(__dirname, req.url);
    const fileExists = fs.existsSync(path.join(__dirname, `/views/${req.url}`));
    if(req.url === '/'){
        req.url = 'login.html';
        return res.sendFile(path.join(__dirname, `/views/${req.url}`));
    }
    else if(fileExists)
        return res.sendFile(path.join(__dirname, `/views/${req.url}`));
    else
        return res.sendFile(path.join(__dirname, `/views/error404.html`));
})

//-------------------------------------------------------------
//for self signed SSL certificate use
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const serverInit = async function (){
    try{
        const con = await mongoose.connect(`${process.env.MONGODB_CONN_STR}`);
        app.listen(process.env.APP_PORT || 3000);
        console.log(`Server is running on PORT: ${process.env.APP_PORT}`);
        // mongoose.set('debug', true);
    }
    catch(err){
        console.error(err);
    }
};
serverInit();

