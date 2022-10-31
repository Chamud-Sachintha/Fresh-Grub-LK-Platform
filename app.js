const { Sequelize } = require('sequelize');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv').config();

const asciiGen = `
________                             __               ______                       __              __        __    __       
/        |                           /  |             /      \                     /  |            /  |      /  |  /  |      
$$$$$$$$/______    ______    _______ $$ |____        /$$$$$$  |  ______   __    __ $$ |____        $$ |      $$ | /$$/       
$$ |__  /      \  /      \  /       |$$      \       $$ | _$$/  /      \ /  |  /  |$$      \       $$ |      $$ |/$$/        
$$    |/$$$$$$  |/$$$$$$  |/$$$$$$$/ $$$$$$$  |      $$ |/    |/$$$$$$  |$$ |  $$ |$$$$$$$  |      $$ |      $$  $$<         
$$$$$/ $$ |  $$/ $$    $$ |$$      \ $$ |  $$ |      $$ |$$$$ |$$ |  $$/ $$ |  $$ |$$ |  $$ |      $$ |      $$$$$  \        
$$ |   $$ |      $$$$$$$$/  $$$$$$  |$$ |  $$ |      $$ \__$$ |$$ |      $$ \__$$ |$$ |__$$ |      $$ |_____ $$ |$$  \       
$$ |   $$ |      $$       |/     $$/ $$ |  $$ |      $$    $$/ $$ |      $$    $$/ $$    $$/       $$       |$$ | $$  |      
$$/    $$/        $$$$$$$/ $$$$$$$/  $$/   $$/        $$$$$$/  $$/        $$$$$$/  $$$$$$$/        $$$$$$$$/ $$/   $$/       
                                                                                                                            
                                                                                                                            
                                                                                                                            
`;
const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/fresh_grub_lk')

try {
  sequelize.authenticate();
  console.log(asciiGen);
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

var indexRouter = require('./routes/index');
var customerRouter = require('./routes/customer');
var sellerRouter = require('./routes/seller');
var categoryRouter = require('./routes/category');
var eatableRouter = require('./routes/eatable');
var profileRouter = require('./routes/profile');

var app = express();

app.use(express.json({limit: "10mb", extended: true}));
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/seller', sellerRouter);
app.use('/category', categoryRouter);
app.use('/eatable', eatableRouter);
app.use('/profile', profileRouter);

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
