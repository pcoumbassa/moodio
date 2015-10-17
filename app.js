var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');
var Audio = require('./models/audio');
var Play = require('./models/play');
var app = express();
app.io = require('socket.io')();
var Account = require('./models/account');

var Player = require('player');

app.io.on('connection', function (socket) {
  var path = './audio/';
  var query = Audio.find(null);

  var p = new Player('./audio/04 - Often.mp3');

  socket.on('play', function(data){
    p.play();
  });

 socket.on('title',function(data) {
    p.stop();
    p = new Player('./audio/' + data.title + '.mp3');
    p.play();

    /*Account.update({pseudo: data.audio_username, audio: {$elemMatch: {title: data.title}}}, {$addToSet:{"audio.$.playBy": { username : data.username}}},function(err){
                    if (err) {
                        console.log(err);
                    }
                        else {
                            console.log("play insert");
                        }
                })*/
    var audioName = data.title
    Audio.update({title: audioName}, {$inc: {listening : 1}})
    /*Audio.find({title: audioName}).exec(function(err,data){
      socket.emit('listening',{listening: data[0].listening});
    });*/
    
    })
  

 socket.on('like',function(data){
      var query = Account.find({"audio.title": data.title, "audio.like.username": data.username});
      query.exec(function(err,data_query){
        if (data_query.length == 0) {
            Account.update({pseudo: data.audio_username, audio: {$elemMatch: {title: data.title}}}, {$addToSet:{"audio.$.like": { username : data.username}}},function(err){
              if (err) {
                  console.log(err);
              }
                  else {
                      console.log("like insert");
                  }
          })
        }
        else {
            Account.update({pseudo: data.audio_username, audio: {$elemMatch: {title: data.title}}}, {$pull:{"audio.$.like": { username : data.username}}},function(err){
              if (err) {
                  console.log(err);
              }
                  else {
                      console.log("like remove");
                  }
          })
        }
      })
 })


 socket.on('pin',function(data){
      var query = Account.find({"audio.title": data.title, "audio.pin.username": data.username});
      query.exec(function(err,data_query){
        if (data_query.length == 0) {
            Account.update({pseudo: data.audio_username, audio: {$elemMatch: {title: data.title}}}, {$addToSet:{"audio.$.pin": { username : data.username}}},function(err){
              if (err) {
                  console.log(err);
              }
                  else {
                      console.log("pin insert");
                  }
          })
        }
        else {
            Account.update({pseudo: data.audio_username, audio: {$elemMatch: {title: data.title}}}, {$pull:{"audio.$.pin": { username : data.username}}},function(err){
              if (err) {
                  console.log(err);
              }
                  else {
                      console.log("pin remove");
                  }
          })
        }
      })
 })

    socket.on('stop', function(socket) {
      p.stop();
    });
});



//Configurationg Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/moodiodb');

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
