## MongoDB

MDN网址：https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB

菜鸟教程：https://www.runoob.com/mongodb/mongodb-tutorial.html

MongoDB的官网：www.mongodb.com

MongoDB可视化工具官网：https://robomongo.org/

nodejs 连接MongoDB：https://www.runoob.com/nodejs/nodejs-mongodb.html

GitHub上关于node连接使用MongoDB：https://github.com/mongodb/node-mongodb-native  官方提供的node使用的MongoDB包，但是开发不使用这个。需要使用第三方包： mongoose——在官方的node相关的mongodb包进行了封装。

官网：https://mongoosejs.com/

后续开发node使用的就是这个包。



师从菜鸟教程的MongoDB：https://www.runoob.com/mongodb/mongodb-tutorial.html

### 介绍

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![img](https://www.runoob.com/wp-content/uploads/2013/10/crud-annotated-document.png)



### 概念

数据库database —— 表/集合collocation —— 文档 document

```
  db(MongoDB的默认数据库为"db"，该数据库存储在data目录中)
	——admin
	——config
	——local
	——test(数据库)
		——collectionName1
		——collectionName2
		——collectionName3
			——document1
			——document2
			——document3(每条数据)
		
```

有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。

- **admin**： 从权限的角度来看，这是"root"数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
- **local:** 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- **config**: 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息。

MongoDB 中默认的数据库为 test，如果你没有创建新的数据库，集合将存放在 test 数据库中。且创建test数据库。

#### 1、下载、安装（windows）

Community Server  社区版

官网地址：https://www.mongodb.com/try/download/community

**安装：**

custom自定义安装，根据菜鸟教程的安装指导进行安装。

需要配置环境变量：bin的路径复制，配置到环境变量的Path路径中。

查看是否安装成功：使用cmd启动，git bash在桌面上时，无法识别`mongod`命令

```sh
mongod --version
```



**创建数据目录**：

MongoDB 将数据目录存储在 db 目录下。但是这个数据目录不会主动创建，我们在安装完成后需要创建它。**请注意，数据目录应该放在根目录下**。(如： C:\ 或者 D:\ 等 )。

我已经在 C 盘安装了 mongodb，现在让我们创建一个 data 的目录然后在 data 目录里创建 db 目录。

```sh
cd C:\
mkdir "data\db"
```

你也可以通过 window 的资源管理器中创建这些目录，而不一定通过命令行。

#### 启动运行 MongoDB 服务器

windows下可以直接执行在MongoDB的文件夹下的bin目录下的mongod.exe，进行启动MongoDB服务器。

也可以通过命令行直接启动`mongod`

当执行`mongod`命令时，默认在**该盘符**下的data/db文件夹下进行数据存储。

如果没有配置环境变量，需要这样执行：

```sh
mongod --dbpath D:\MongoDBdata(数据存放的目录)
```

在其他盘符启动数据库，比如在D盘启动：

```
mongod --dbpath d:\data\db
```



**关闭服务器命令：**

在控制台Ctrl+C停止。

**连接命令：**

再开一个命令提示符窗口，执行 `mongo` 默认连接本地的开启状态的MongoDB数据库。

#### 2、使用

#### （1）数据库

**查看数据库**

```sh
show dbs
```

**创建或切换数据库**

```sh
use test
```

**显示当前的数据库**

```sh
db
```

**删除数据库**

```sh
db.dropDatabase()
```

#### （2）集合

**创建集合**

```
db.createCollection("runoob")
```

createCollection的参数：



**显示集合**

```
show collections
```

在 MongoDB 中，你不需要创建集合。当你插入一些文档时，MongoDB 会自动创建集合。

```
db.mycol2.insert({"name" : "菜鸟教程"})
```

**删除集合**

比如：接着删除集合 mycol2 :

```
db.mycol2.drop()
```

#### （3）文档

文档的数据结构和 JSON 基本一样。所有存储在集合中的数据都是 BSON 格式。BSON 是一种类似 JSON 的二进制形式的存储格式，是 Binary JSON 的简称。

**插入文档**

```
db.collectionName.insert()
db.collectionName.insertOne()
db.collectionName.insertMany()
```

db.collection.insertOne() 用于向集合插入一个新文档，语法格式如下：

```sh
db.collection.insertOne(
   <document>,
   {
      writeConcern: <document>
   }
)
```

db.collection.insertMany() 用于向集合插入一个多个文档，语法格式如下：

```
db.collection.insertMany(
   [ <document 1> , <document 2>, ... ],
   {
      writeConcern: <document>,
      ordered: <boolean>
   }
)
```

。。。

**更新文档**

update() 方法用于更新已存在的文档。语法格式如下：

```
db.collectionName.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

*参数说明：*

- **query** : update的查询条件，类似sql update查询内where后面的。
- **update** : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
- **upsert** : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
- **multi** : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
- **writeConcern** :可选，抛出异常的级别。

https://www.runoob.com/mongodb/mongodb-update.html

。。。

删除文档

查询文档

条件操作符

$type操作符

skip(), limilt(), sort()







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



