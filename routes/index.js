var express = require('express');
var router = express.Router();
/* 连接数据库 */
var model = require('./model');
model(router);
module.exports = router;