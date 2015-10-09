var moment = require('moment');
// 数据库
var mongoose = require('mongoose'),
    dbname = 'mongodb://localhost/todo';
// 连接单个数据库
mongoose.connect(dbname);

var db  = mongoose.connection;

// 检测数据库连接状态
db.on('error',function(){
    console.log('数据库连接错误')
});

db.on('connected',function(){
    console.log('数据库连接成功');
})

db.on('disconnected',function(){
    console.log('数据库断开连接');
});

// 在程序运行时就打开连接，而程序停止或重启时就需要手动断开数据库连接
process.on('SIGINT',function(){
    db.close(function(){
        console.log('数据库断开连接');
        process.exit(0);
    });
});

// Schema: 文档的数据结构
var Schema = mongoose.Schema;

/*
  todo Schema
 */

var todoSchema = new Schema({
    isDone: Boolean,
    status: String,
    title: {type:String,default:'未命名标题',trim:true},
    time: String,
    desc: String
});


// model: 处理数据
/*
  todo Model
 */

var todoModel  = mongoose.model('todoModel',todoSchema);


// todoModel.remove({},function(err){
//     if (err) return console.log(err);
//     console.log('remove all');
// });

// todoModel.create([{isDone: false,status:'hell',title:'hell world',time: moment().valueOf(),desc:'this is the first data'},{isDone: true,status:'easy',title:'hell world2',time:moment().valueOf(),desc:'this is the second data'}],function(err){
//     if (err) return console.log(err);
//     console.log('create');
// });

// todoModel.find({},function(err,docs){
//     if (err) return console.log(err);
//     console.log(docs);
// });

/**
 * Methods 为Schema 创建方法，绑定在Schem下，给实例使用
 */


/**
 * Statics 静态方法，在model层就能使用，绑定在Schema下
 */


module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res) {
        //render方法，对网页模板进行渲染。render方法的参数就是模板的文件名，默认放在子目录views之中，后缀名已经在前面指定为html
        //res.render('index') 就是指，把子目录views下面的index.html文件，交给模板引擎ejs渲染。
        res.render('index');
    });

    app.get('/todos', function(req, res) {
        todoModel.find().exec(function(err,data){
           if (err) return console.log(err);
           res.json(data);
        });
    });


    app.get('/todo/:_id',function(req,res){
        var _id = req.params._id;
        todoModel.findOne({_id:_id}).exec(function(err,docs){
            if(err) return console.log(err);
            res.json(docs);
        })
    });
}