var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors"); 

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireToo API",
      version: "1.0.0",
      description: "Documentation des API du backend HireToo"
    },
  },
  apis: ["./routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

require ('dotenv').config()

var app = express();

app.use(cors()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/users/auth');
var checkUserRouter = require('./routes/users/checkUser');
var updateUserRouter = require('./routes/users/updateUser');
var deleteRouter = require ('./routes/users/deleteUser');

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/checkUser', checkUserRouter);
app.use('/updateUser', updateUserRouter);
app.use('/deleteUser', deleteRouter);

module.exports = app;
