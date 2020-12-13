## MongoDB

MDN网址：https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB

菜鸟教程：https://www.runoob.com/mongodb/mongodb-tutorial.html

MongoDB的官网：www.mongodb.com

MongoDB可视化工具官网：https://robomongo.org/

nodejs 连接MongoDB：https://www.runoob.com/nodejs/nodejs-mongodb.html

GitHub上关于node连接使用MongoDB：https://github.com/mongodb/node-mongodb-native  官方提供的node使用的MongoDB包，但是开发不使用这个。需要使用第三方包： mongoose——在官方的node相关的mongodb包进行了封装。

官网：https://mongoosejs.com/

后续开发node使用的就是这个包。



### 介绍

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![img](https://www.runoob.com/wp-content/uploads/2013/10/crud-annotated-document.png)



#### 1、下载

Community Server  社区版

需要配置环境变量：bin的路径复制，配置到环境变量的Path路径中。

关于数据库，最好一步安装下去

查看是否安装成功：

```shell
mongod --version
```



#### 2、使用

启动命令：`mongo`

当执行mongod命令时，默认在该盘符下的data/db文件夹下进行数据存储。而且如果没有这个目录，将启动MongoDB数据库。

关闭服务器命令：在控制台Ctrl+C停止。

连接命令：`mongo` 默认连接本地的开启状态的MongoDB数据库。

关闭连接状态：`exit`



#### 基本命令——对MongoDB数据库的命令操作

show dbs ：显示所有的数据库。注意MOngoDB中有默认的数据库，不要动。

db：查看当前连接的数据库

use 数据库名：切换到指定的数据库

show collocations：显示当前数据库的集合

db.集合名.find()：查看该集合的数据 

。。。

MongoDB可以这么理解：

多个数据库 》多个集合数组 》多个文档对象

文档 结构 很 灵活 ，没有任何 限制 ，非常灵活。

```javascript
{
    数据库1：{
        表1：[//集合
            {},//文档
            {},
            {},
        ],
        表2：[]
    },
    数据库2：{
        表1：[],
        表2:[]
    }
}
```



## node开发中需要连接mongoose

mongoose官网：https://mongoosejs.com/.

官方指南：http://mongoosejs.com/docs/guide.html

官方api文档 ：http://mongoosejs.com/docs/api.html

官网ES6写法 ，

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema; //获取数据的Schema
mongoose.connect('mongodb://localhost/test',{useMongoClient: true});//连接服务器的test数据库，该数据库可以不用存在，当存入数据时，自动建立test数据。
//设计集合结构（表结构 ）即每个文档都应该是下面的结构
var blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{body:Sring, date: Date}],
    date:{type: Date, default: Date.now}
})
//参数1：大写字符串，存入数据中是blogs
//参数2：架构Schema
//返回值：模型构造函数
var Blog = mongoose.model('Blog', blogSchema);//将文档结构发布为模型

//可以用模型构造函数Blog操作数据库中的集合blogs——增删改查
//增——通过模型构造函数Blog进行新增
var documentBolg = new Blog({//按设计好的集合，来创建文档
    title："",
    author: "",
    body: "",
    ...
})
documentBolg.save(function(err, data){//documentBolg文档进行保存，且调用对应的回到函数
    
})

//查询——通过模型构造函数Blog进行查询
//查询所有文档——即blogs集合
Blog.find(function(err, data){
    if(err){
        
	}else{
        console.log(data);
    }
})
//条件查询——找到符合条件的文档组成的数据（小集合、集合部分） —— 
Blog.find({  //并且
    title: "",
    author: ""
},function(err, data){
    
})
//条件查询——找打符合条件的一个，得到一个文档（对象）
Blog.findOne({
    title: ""
},function(err, data){

})
//或查询呢？


//删除，删除符合条件的所有文档对象。
Blog.remove({
    title: ""
}, function(err, data){
    
})
//根据条件删除一个
Blog.findOneAndRemove()
//根据Id删除一个
Blog.findByIdAndRemove()

//更新数据  好像每项文档对象有mongodb自己生成的ID字符串。
Blog.findByIdAndUpdate('id字符串',{title：""}, funcion(err, data){
                       
                     })

//根据条件更新所有符合的
Blog.update()

//根据条件更新一个
Blog.findOneAndUpdate()



```

还有更多api。。。

https://www.runoob.com/mongodb/mongodb-query.html

数据完整性，防止脏数据。

```shell
Schema中：
type：规定类型，Sting、Date、Number、Boolean等
required：是否必须。true是，false否

```



需要注意的是：在node中，也向路由那样，单一职责原则去创建操作数据的js文件。然后module.exprots导出使用。



默认端口27017，就像80端口那样，可以省略。



###  MongoDB图像化界面软件 

mongoBooster、mongodb compass

唯一标示id是：_id

#### MongoDB所有的api都支持Promise

所以可以查完某个字段后，再继续往后查询 。

对数据 的操作都是异步的。通过Promise的使用，避免嵌套





### Node操作MySQL数据

极其简单。。。



### 设计数据模型





#### 实战

设计数据库的文件结构：

建一个models文件夹，用于存所有的操作mongodb的js文件。每个js文件单一职责，去干一个事情。



#### 加密密码

下载md5包，对密码多次加密

`blueimp-md5`



