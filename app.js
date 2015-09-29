var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./routes');
var app = express();


/* 设置渲染引擎 */
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
// 默认的ejs
// app.set('view engine','ejs');


/* use方法调用/注册中间件 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 访问localhost:3000时的路由处理，以下分别是 静态路由 & 动态路由
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// 错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// 开发环境下的错误处理
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// 生产环境下的错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* 导出对象，module.exports */
module.exports = app;