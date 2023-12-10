require('dotenv').config();
const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');

const expenseRoutes = require('./routes/expense-route');
const loginRoutes = require('./routes/login-route');
const membershipRoutes = require('./routes/membership-route');
//---------------------------------------------------------------

const app = express();

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));

//--------------------------------------------------------------

app.use('/expense', expenseRoutes);

app.use('/user', loginRoutes);

app.use('/purchase', membershipRoutes);

app.listen(9000);