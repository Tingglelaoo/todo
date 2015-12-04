#TODO
TODO 是学习MEAN（MongoDB、Express、Angular、Node）技术的项目小实践。
目前release版本为V1.0.0。
完成的基本功能为：

1. 用户注册登录功能
> 登录注册页面自动判断用户有无注册过。**注册的用户名区分大小写**。
2. 通过回车输入，增加单条todo
3. 通过删除按钮，删除单条todo
4. 点击todo列表子项，进行对该todo的修改

> **目前可修改点仅包括**：
 - 备注
 - 优先级 （红、黄、绿 重要性依次降低）


# 安装
事先做好[MEAN环境搭建](https://www.zybuluo.com/Tingglelaoo/note/175242)，做好`Node`、`MongoDB`、`Express`的安装。

1. `git clone` 这个项目。
2. 在**MEAN**环境下，进入到项目目录下，建立`/data`文件夹作为数据存储的路径。
3. 先双击`mongodb.bat`来启动数据库。
> 亦可通过命令行输入以下命令来启动数据库
```
start mongod --dbpath "f://my work//todo//todo//data"
```
4. 用命令行`npm start`来启动项目，即可通过 `localhost:3000`进行访问。

#许可
MIT
