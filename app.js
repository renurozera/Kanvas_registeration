var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var mongoose = require('mongoose');
var userSchema = require('./models/userSchema');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var uploadFile = require('./routes/uploadFile');


var app = express();

//mongodb connection
mongoose.connect('mongodb://localhost/ks16',function(err){
  if(!err){
    console.log('DB CONNECTED');
  }
  else{
    console.log('ERROR IN CONNECTION'+err);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'HIRO_HAMADA_IS_MY_NAME',
  name:'kanvas16',
  resave:true,
  saveUninitialized:false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
console.log('PASSPORT MIDDLEWARES ADDED');

passport.serializeUser(function(user,done){
  console.log('SERIALIZING USER');
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  console.log('DESERIALIZING THE USER');
  console.log(id);
  userSchema.findById(id,function(err,user){
    console.log(user);
    done(err,user);
  });
});

app.use('/', routes);
app.use('/users', users);
app.use('/login',login);
app.use('/register',register);
app.use('/upload',uploadFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
