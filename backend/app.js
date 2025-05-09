var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require ('dotenv').config()

var indexRouter = require('./routes/index');
var authRouter = require('./routes/users/auth');
var checkUserRouter = require('./routes/users/checkUser');
var updateUserRouter = require('./routes/users/updateUser');

var app = express();
const cors = require("cors"); 
app.use(cors()); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/checkUser', checkUserRouter);
app.use('/updateUser', updateUserRouter);


module.exports = app;
