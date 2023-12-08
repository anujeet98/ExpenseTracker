const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');

const expenseRoutes = require('./routes/expense-route');
const userRoutes = require('./routes/user-route');
//---------------------------------------------------------------

const app = express();

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));

//--------------------------------------------------------------

app.use('/expense', expenseRoutes);

app.use('/user', userRoutes);

app.listen(9000);