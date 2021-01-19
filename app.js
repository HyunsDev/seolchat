var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var dayjs = require("dayjs")

var indexRouter = require('./routes/index');


var app = express();

app.io = require('socket.io')();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

function chat_log(message, type, author, send_time) {
  var file_name = dayjs().format('YYYY_MM_DD')
  var datetime = dayjs().format('YYYY-MM-DDTHH:MM:SS')
  let jsonFile
  let jsonData
  
  try {
    jsonFile = fs.readFileSync(`./chat_log/${file_name}.json`, 'utf8');
    jsonData = JSON.parse(jsonFile);
  } catch (err) {
    fs.writeFileSync(`./chat_log/${file_name}.json`, JSON.stringify({date : file_name, message : []}, null, 4))
    jsonFile = fs.readFileSync(`./chat_log/${file_name}.json`, 'utf8');
    jsonData = JSON.parse(jsonFile);
  }

  jsonData["message"].push({
    datetime: datetime,
    message: message,
    type: type,
    author: author,
    time: send_time
  })

  fs.writeFileSync(`./chat_log/${file_name}.json`, JSON.stringify(jsonData, null, 4))
}

app.io.on('connection', function(socket){
  var user = ""

  console.log("유저 연결됨")
  socket.on('disconnect', function(){
      //퇴장
      console.log("유저 퇴장")
      app.io.emit('client', "퇴장", user);
  });
    
  //채팅
  socket.on('chatMessage', function(author, time, msg){
    console.log(`[message] ${socket.id}: ${msg}`);

    if (msg.startsWith("/공지 ")) {
      fs.writeFileSync(`./config/notice.json`, JSON.stringify({content: msg.replace("/공지 ","")}, null, 4))
    }

    app.io.emit('chatMessage', author, time, msg);
    chat_log(msg, "message", author, time)
  });

//클라이언트
  socket.on('client', function(why, data){ 
      app.io.emit('client', "참가", data);
      user = data
  });

  socket.on('hello', function(hi, name){ 
    app.io.emit('hello', hi, name);
  });


});

module.exports = app;
