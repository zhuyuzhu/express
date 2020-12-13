# middleware——中间件

思考一个问题：req中没有以下变量的，但是为什么引入了插件之后就有了呢？

```js
var http = require('http');

var server = http.createServer(function(req, res){
    req.body
    req.query
    req.cookies
    req.session
})
```

中间件的概念：在一个function中，如果req被函数处理后，在req上添加了属性。每个方法都是给req上添加对应的属性或方法。这样这个req对象，就有了很多属性和方法。便于在该function中使用。



### express中的middleware

中间件是个方法，比如下面的app.use，接收三个参数：request对象，response对象，和next方法，next()执行，进入下一个方法。

有next方法执行，意味着后面的中间件必须有执行该请求的中间件。

在Express中，中间件有多个类型：

+ 不关心请求路径和请求方法的，比如：app.use(funciton(req, res, next))方法，所有的请求都出被该方法处理
+ 以什么开头的url路径的中间件，比如：app.use('/a', function(req, res, next))，以/a路径开头的url请求会进入该中间件
+ 严格匹配请求方法和路径的中间件，比如：app.get('/home', function(req, res, next))    app.post('/index', function(req, res, next))。如果是同一个请求的中间件，那么req是可以复用的。

中间件的几种类别官网：https://www.expressjs.com.cn/guide/using-middleware.html

Express是一个路由和中间件的web框架，一个express应用本质上是一系列的中间件函数回调。



如果当前中间件函数没有执行后没有结束request-response，他一定会回调next方法，进入下一个中间件。

中间件的类型有以下几种：

- [Application-level middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.application)
- [Router-level middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.router)
- [Error-handling middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.error-handling)
- [Built-in middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.built-in)
- [Third-party middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.third-party)

## Application-level middleware

通过使用`app.use()`和`app. method()`函数，将应用程序级`application-level`中间件绑定到app对象的实例，其中method是中间件函数用小写字母处理的请求的HTTP方法(如GET、PUT或POST)。

此示例显示了一个没有挂载路径的中间件函数。接收到任何请求方法时，都会执行该函数。

```js
var app = express()

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```

此示例显示了挂载在/user/:id路径上的中间件功能。该函数针对/user/:id路径上的任何类型的HTTP请求执行。

```js
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```

这个例子展示了一个路由和它的处理函数(中间件系统)。该函数处理对/user/:id路径的GET请求。

```javascript
app.get('/user/:id', function (req, res, next) {
  res.send('USER')
})
```

下面是在一个挂载点上加载一系列中间件函数的示例，并使用一个挂载路径。它演示了一个中间件**子堆栈，多个处理函数**。它将任何类型的HTTP请求的请求信息打印到/user/:id路径。**注意：**子堆栈中，处理函数需要调用next方法，才会使下一个处理函数执行；如果某个处理函数中没有执行next方法，程序将不会往后面的处理函数中执行。且没有next方法，意味着不会往后面的中间件执行。

```javascript
app.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```

路由处理程序使您能够为一个路径定义多个路由。下面的示例定义了GET请求到/user/:id路径的两条路径。**第二个路由不会导致任何问题，但是它永远不会被调用，因为第一个路由结束了请求-响应周期。**

此示例显示了一个处理/user/:id路径的GET请求的中间件子堆栈。

```javascript
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id)
})
```

要跳过路由器中间件堆栈中的其余中间件函数，请调用next('route')将控制传递给下一个路由。

注意: next('route')将仅在使用app.METHOD()或router.METHOD()函数加载的中间件函数中工作。比如：app.get、app.post

示例：

```js
app.get('/getform', (req, res, next) => {
    console.log(111);
    res.end(req.query.fname)
    next('route');
}, (req, res, next) => {
    console.log(222);
})

app.get('/getform', (req, res) => {
    console.log(333);
    res.end(333)
})
```

当请求/getform路径时，打印111 、 333



此示例显示了一个处理/user/:id路径的GET请求的中间件子堆栈。

```javascript
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function (req, res, next) {
  res.send('special')
})
```

**中间件也可以在数组中声明以实现可重用性**

这个示例展示了一个带有中间件子堆栈的数组，该数组处理对/user/:id路径的GET请求。

```javascript
function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

var logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, function (req, res, next) {
  res.send('User Info')
})
```

## Router-level middleware

路由器级中间件的工作方式与应用程序级中间件相同，只是它被绑定到express.Router()的一个实例。

```javascript
var router = express.Router()
```

使用router.use()和router.METHOD()函数加载router级中间件。

下面的示例代码通过路由器级中间件复制了上面显示的应用程序级中间件系统：

```javascript
var app = express()
var router = express.Router()

// 没有挂载路径的中间件功能。对于路由的每个请求，都执行此代码
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id)
  res.render('special')
})

// 挂载路由到app上
app.use('/', router)
```

要跳过路由器中间件的其余功能，请调用next('router')将控制传回路由器实例。

此示例显示了一个处理/user/:id路径的GET请求的中间件子堆栈。

```javascript
var app = express()
var router = express.Router()

// predicate the router with a check and bail out when needed
router.use(function (req, res, next) {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/', function (req, res) {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, function (req, res) {
  res.sendStatus(401)
})
```

## Error-handling middleware

> 错误处理中间件总是接受四个参数。您必须提供四个参数来将其标识为错误处理中间件函数。即使不需要使用下一个对象，也必须指定它来维护签名。否则，下一个对象将被解释为常规中间件，并且将无法处理错误。

定义错误处理中间件函数的方式与其他中间件函数相同，除了使用四个参数而不是三个参数，特别是签名(err, req, res, next))

```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

有关错误处理中间件的详细信息，请参见:错误处理[Error handling](https://www.expressjs.com.cn/en/guide/error-handling.html).。

**全局错误处理中间件**

接收四个参数：error、request、response、next

如果next方法接收了参数，将直接进入到带有四个参数的app.use中间件中。

```js
app.get('/', function(req, res, next){
	fs.readFile('./a/b/c', function(err, data){
        if(err){
            console.log("读取c文件失败");
            next(err); // 吧err错误对象，传入到全局错误处理中间件中，进行处理。
		}else {
            
		}
    })
})
app.get('/index', function(req, res, next){
	fs.readFile('./a/b/index', function(err, data){
        if(err){
            console.log("读取index文件失败");
            next(err);
		}else {
            
		}
    })
})

//错误处理中间件，此处不可以少些参数，三个参数会被识别为request、response、next。
app.use(function(err, req, res, next){
    console.log(err);
    console.log('app is error');
})
```

**处理404中间件**

如果前面的中间件没有匹配到，那么就进入该中间件中

```js
app.use(function(req, res){
    res.render('404.html')
})
```



## Built-in middleware

从版本4开始。表示不再依赖于连接。以前包含在Express中的中间件功能现在在单独的模块中;请参阅中间件功能列表[the list of middleware functions](https://github.com/senchalabs/connect#middleware).。

Express有以下内置的中间件功能:

- [express.static](https://www.expressjs.com.cn/en/4x/api.html#express.static) serves static assets such as HTML files, images, and so on.
- [express.json](https://www.expressjs.com.cn/en/4x/api.html#express.json) parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
- [express.urlencoded](https://www.expressjs.com.cn/en/4x/api.html#express.urlencoded) parses incoming requests with URL-encoded payloads. **NOTE: Available with Express 4.16.0+**

## Third-party middleware

使用第三方中间件添加功能来表达应用程序。

为所需的功能安装Node.js模块，然后在应用程序级别或路由器级别将其加载到应用程序中。

下面的示例演示如何安装和加载cookie-解析中间件函数cookie-parser。

```sh
$ npm install cookie-parser
```

```javascript
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')

// load the cookie-parsing middleware
app.use(cookieParser())
```

有关Express常用的第三方中间件功能的部分列表，请参阅:第三方中间件[Third-party middleware](https://www.expressjs.com.cn/resources/middleware.html)。

第三方中间件：https://www.expressjs.com.cn/resources/middleware.html

### 统一处理不存在的页面

在中间件最后，来监听未被处理的请求。

```js
app.use(function(req, res, next){
    res.setHeader('content-type', 'text/html')
    return res.end('<h2>error </h2>')
})
```





第三方中间件：https://www.expressjs.com.cn/resources/middleware.html

### 补充：postman软件，模拟请求





![image-20201207212620974](C:\Users\朱玉柱\AppData\Roaming\Typora\typora-user-images\image-20201207212620974.png)







