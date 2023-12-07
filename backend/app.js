const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');

const appRoutes = require('./routes/app-route');
const userRoutes = require('./routes/user-route');
//---------------------------------------------------------------

const app = express();

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));

//--------------------------------------------------------------

app.use('/expenseApp', appRoutes);

app.use('/user', userRoutes);

app.listen(9000);