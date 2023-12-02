
const express = require('express');
const cors = require('cors');   
const bodyParser = require('body-parser');
const appRoutes = require('./Routes/route.js');
//---------------------------------------------------------------

const app = express();

//---------------------------------------------------------------

app.use(cors());
app.use(bodyParser.json({extended: false}));

//--------------------------------------------------------------

app.use('/expenseApp', appRoutes);

app.listen(9000);