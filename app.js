const { Sequelize } = require('sequelize');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// "start": "node ./bin/www"
// const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')
// //const sequelize = new Sequelize('postgres://fawauotvwubhtm:47cb37a2c72a1d56375e836490f8c781ecd8011f1a5af11ed9b1550502de9cd5@ec2-3-219-19-205.compute-1.amazonaws.com:5432/d8ul24hse3bg9b');

// try {
//   sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

var indexRouter = require('./routes/index');
var customerRouter = require('./routes/customer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/customer', customerRouter);

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
