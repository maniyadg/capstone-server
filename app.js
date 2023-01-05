var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("dotenv").config()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminUsersRouter = require('./routes/admin/users')
var adminforgetRouter = require('./routes/admin/forget')
var adminproductRouter = require('./routes/admin/product')
var cors = require('cors')
const nodemailer = require("nodemailer");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "https://capstone-server-xp65.onrender.com",
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/admin/user', adminforgetRouter);
app.use('/admin/items', adminproductRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
