# Express

1、官网：http://expressjs.com

2、作者：https://github.com/tj   koa

## 目标

使用node作为服务器，解决大部分时间。而非用node去操作系统或者处理文件等。

### 使用

**1、开放静态文件**

开放静态文件官网：https://www.expressjs.com.cn/starter/static-files.html

+ `express.static`是中间件

开放某个文件夹的资源：

```js
express.static(root, [options])
```



可以让静态资源公开：您提供给`express.static`函数的路径是相对于您启动`node`过程的目录的。如果从另一个目录运行express应用，则使用要提供服务的目录的绝对路径更为安全——fs操作文件和开放静态文件时，是针对控制台界面的。

```js
var express = require('express')
var app = express()

//get请求
app.get('/', function (req, res) {
  res.send('hello world')
})

//开放静态资源
app.use('/public', express.static('./public/')) //请求路径必须有public才能访问public里面的资源
app.use(express('./public/'))  //请求路径不加public才能访问public里面的资源

```

2、req 和 res对象中有什么？原生的属性和api是可以用，express框架也添加了属性和api，不推荐使用原生的了。

（1）express提供了res.redirect()重定向方法，res.redirect('/') 重定向到根路径。

（2）req.query 获取的是查询字符串的数据，就是Query String Parameters的数据。比如GET请求的后面拼接的字符串。那么POST请求默认是没有，因为POST请求是Form Data。（好像可以配置让POST也字符串发送数据）



#### 3、node中使用art-template

安装：express-art-template依赖art-template

```shell
npm install --save art-template
npm install --save express-art-template
```

使用：example

```javascript
var express = require('express');
var app = express();

// view engine setup
//渲染.art文件时，使用express-art-template模板引擎
app.engine('art', require('express-art-template')); 
app.set('view', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views')); //修改默认目录views
app.set('view engine', 'art'); //设置加载文件类型

// routes
app.get('/', function (req, res) {
    res.render('index.art', {  //res.render方法来自express-art-template
        user: {
            name: 'aui',
            tags: ['art', 'template', 'nodejs']
        }
    });
});
```

node中，express-art-template的render方法的使用，`res.render('art文件名'，{模板数据})`，第一个参数直接写文件名，不能是路径。并且express-art-template默认会去文件夹名为`views`的目录中查找文件。第二个参数数据，可以不填。

可以修改配置，让render识别html文件

```html
app.engine('html', require('express-art-template')); 
```

再来理解html文件的位置，res.render时，默认查找`views/名.html`文件，如果views下的home文件夹下的home.html呢？

```javascript
app.get('/home', (req, res) => {
    res.render('home/home.html')
})
```

#### 4、express如何获取form表单的POST请求的From Data请求体数据？

需要第三方插件——中间件：https://www.expressjs.com.cn/en/resources/middleware/body-parser.html

安装：

```shell
npm install body-parser --seve
```



**好像新版express里面集成了**



### 5、CRUD

增加(Create)、查(Retrieve)、更新(Update)和删除(Delete)

#### 6、nodemon

`nodemon`修改文件即重启node服务的插件

`npm install --global nodemon` 全局安装

原本是node app.js启动服务，如果使用nodemon，nodemon app.js启动

两次Ctrl+C 停止服务

### 路由

路由设计思想：

（1）表格设计每个路径，传参、获取的值、对应的业务。

（2）多个路由文件，且用函数导出的方式，接收app参数使用——思想，express包装了路由

单一职责原则，每个路由模块的职责要单一，且所有的路由都把职责区分好，别混乱。

**express中的路由：**

（3）router.js中

```javascript
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    
})
router.get('/home', (req, res) => {
    
})
module.exports = router
```

在app.js中

```javascript
var router = require('./router.js');

//把router挂载到app上，即可生效
app.use(router);
```

### 封装Promise的API

核心在于 封装的函数中，直接：

return new Promise（）

之后可以连续调用Promise的其他API



jquery对Promise也进行了兼容：可验证 。

```javascript
$.get("")
    .then(function(res1){
    	if(res1.seccess){
            
			return $.get(url)
   		}
	})
	.then(function(res2){
    	//因为这个处理函数没有在上面的处理函数中
    //所以这里不能使用res1这个变量。除非把res1保存到作用域外。
	})
```

那么在使用jquery开发的时候，遇到要多次回调的ajax操作：0-

```javascript
$.get(url, funcion(res){
     if(res.success){
    	//成功后再执行
    	return $.get(url, function(res))
	} else{
        
    }
 })
```



### 开启一个接口的插件

1、`json-server`

使用在test.json文件中创建json格式的数据，然后执行命令开启接口服务器：`json-server --watch test.json`

如果test.json数据如下：

```json
{
    "users": [
        {
           "id": 1,
            "username": "admin1"
        },
        {
            "id": 2,
            "username": "admin2"
        }
    ],
    "jobs": [
        {
            "id": 1,
            "jobname": "学生"
        },
        {
            "id": 2,
            "jobname": "老师"
		}
    ]
}
```

当请求：

test.json对应的服务器路径 /users  或者 /jobs时，获取对应的json数据。

还可以 在 /users/1   或者 /users/2  默认后面加的是id的值。可以访问到该id对应的数据。

2、hs -c-1 -o

可以在浏览器中获取像Apache那样的目录文件

但是这是个什么插件呢？



#### body-parse



**文件user.js**

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
		type: String,
        required: true
    },
    password: {
		type: String,
        required: true
    },
    create_time: { //创建时间，
        type: Date,
        default: Date.now
    }
    last_modified_time: {
    	type: Date,
    	default: Date.now
	},
    avatar: {
        type: String,
                            default: '/avatar-default.png'
    },
    bio: {
        type: String,
        default: "个人简介"
    },
    gender: {//性别：男 女 保密
        type: Number,
        enum: [-1,0,1],
        default: -1 //保密
    },
    birthday: {
        type: Date,
        default: ''
    },
    status: {//每个用户状态，可以评论、登录、能否发表文章等等。——权限更合理
        type: Number,
        enum: [0,1,2,3,4]
        default: 0
    }
})
module.exports = mongoose.model('User', userSchema);// 导出后名为users的集合名
```

设计数据库的文件结构：

建一个models文件夹，用于存所有的操作mongodb的js文件。每个js文件单一职责，去干一个事情。

在app.js 中引入上面的文件，并命名

```js
var User = require('user.js'); //注意数据库中的集合名；这里是引入文件名。


//连接数据库

```



express中，提供了res.json方法，可以将数据JSON字符串化。比如：

```js
res.json({
    seccess: true
})
```



**form表单的特点**

method：GET 、POST

action："/url地址"

表单默认就是同步提交，同步提交表单，会把服务器响应的数据直接渲染到页面上。页面内容发现变化，url地址可没有变。因为之前的时候，还没有ajax的出现。

所以用表单同步提交时，响应的内容需要服务器妥善处理。

比如，如果账号已经注册，或者密码错误，可以让服务器重现渲染该页面，且让响应内容添加该账号，添加提示词，这样的html页面。

异步提交是ajax处理的。

form表单的使用呢？还没用过。



**服务端重定向对异步请求无效**

res.redirect(/)

**只能通过前端来进行重定向，location.href**



express中的api



req和res的方法：https://www.runoob.com/nodejs/nodejs-express-framework.html











