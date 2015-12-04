var moment = require('moment');
var crypto = require('crypto');
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todoModel'
    },
    isDone: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'easy'
    },
    title: {
        type: String,
        default: '未命名标题',
        trim: true
    },
    time: {
        type: String,
        default: Date.now()
    },
    desc: {
        type: String,
        default: '在这里可以添加备注喔...'
    }
});

/*
  user Schema
 */

var userSchema = new Schema({
    username: {
        type : String,
        trim : true,
        default:''
    },
    password: {
        type: String,
        trim: true,
        default:''
    }
});

// model: 处理数据
/*
  todo Model
 */
var todoModel  = mongoose.model('todoModel',todoSchema);

/*
  user Model
 */
var userModel  = mongoose.model('userModel',userSchema);


// 加密密码
function encryptPassword(user) {
    var password = user.password;
    if (!password) return '';
    var hashed_password = crypto.createHash('sha1').update(password).digest('hex');
    console.log(hashed_password);
    user.password = hashed_password;
    return user;
}


module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res) {
        //render方法，对网页模板进行渲染。render方法的参数就是模板的文件名，默认放在子目录views之中，后缀名已经在前面指定为html
        //res.render('index') 就是指，把子目录views下面的index.html文件，交给模板引擎ejs渲染。
        res.render('index');
    });

    /* todos */
    // 获取全部todo
    app.get('/todos/:userId', function(req, res) {
        var userId = req.params.userId;
        todoModel.find({userId:userId}).exec(function(err,data){
           if (err) return console.log(err);
           res.json(data);
           console.log(data);
        });
    });

    // 根据id 获取单个 todo
    app.get('/todo/:_id',function(req,res){
        var _id = req.params._id;
        todoModel.findOne({_id:_id}).exec(function(err,docs){
            if(err) return console.log(err);
            res.json(docs);
        });
    });

    // 增
    app.post('/todo/add',function(req,res){
        var todo = new todoModel(req.body);
        console.log(todo);
        todo.save(function (err, docs) {
            if(err) return console.log(err);
            res.json({status: 'done'});
        });
    });

    // 改
    app.post('/todo/update',function(req,res){
        console.log(req.body);
        var data = req.body;
        var q = todoModel.findOne({_id:data._id});
        todoModel.update(q,{$set:data}).exec(function(err,docs){
            if(err) return console.log(err);
            console.log(docs);
            res.json({status:'done'});
        })
    });

    // 删
    app.post('/todo/remove',function(req,res){
        var data = req.body;
        todoModel.findOne({_id:data._id}).exec(function(err,docs){
            if(err) return console.log(err);
            console.log(docs);
            docs.remove(function(err){
                 if(err) return console.log(err);
                res.json({status:'done'});
            });
        });
    });

    /* users */

    // 注册
    app.post('/signUp',function(req,res){
        var user = new userModel(req.body);
        user = encryptPassword(user);
        user.save(function (err, docs) {
            if(err) return console.log(err);
            res.json(docs);
        });
    });

    // 登录
    app.post('/logIn',function(req,res){
        var user = req.body;
        user = encryptPassword(user);
        userModel.findOne(user).exec(function(err,docs){
            if(err) return console.log(err);
            if( docs == null ) {
                res.sendStatus(404);
            }
            else {
                res.json(docs);
            }
        });
    });

    // 检测
    app.get('/checkUsername/:username',function(req,res){
        var username = req.params.username;
        userModel.findOne({ username : username }).exec(function(err,docs){
            if(err) return console.log(err);
            if( docs == null ) {
                res.sendStatus(404);
            }
            else {
                res.json(docs);
            }
        });
    });
}