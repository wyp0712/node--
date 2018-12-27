var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser")
var cors = require("cors")
    //加载ueditor 模块
var ueditor = require("ueditor");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// 后台管理系统
// 后台路由
var BackIndexRouter = require('./routes/back/index');
app.use('/back', BackIndexRouter);


// 后台接口


var api_back_user = require("./api/back/user")
app.use('/api/back/user', api_back_user);

var api_back_classManage = require("./api/back/classManage")
app.use('/api/back/classManage', api_back_classManage);

var api_back_questionsManage = require("./api/back/questionsManage")
app.use('/api/back/questionsManage', api_back_questionsManage);


//前台路由
var clientRouter = require('./routes/client/index');
app.use('/', clientRouter);

//前台接口
var api_client_questions = require('./api/client/questions');
app.use('/api/client/questions', api_client_questions);

//事件循环
var { loop } = require("./module/loop")
loop()


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