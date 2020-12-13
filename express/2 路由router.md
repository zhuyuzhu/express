## express中路由router

#### 路由

*路由*是指应用程序的端点（URI）如何响应客户端请求。有关路由的介绍，请参见[基本路由](https://www.expressjs.com.cn/en/starter/basic-routing.html)。

您可以使用`app`与HTTP方法相对应的Express对象的方法来定义路由。例如，`app.get()`处理GET请求和`app.post`处理POST请求。有关完整列表，请参见[app.METHOD](https://www.expressjs.com.cn/en/4x/api.html#app.METHOD)。您还可以使用[app.all（）](https://www.expressjs.com.cn/en/4x/api.html#app.all)处理所有HTTP方法，并使用[app.use（）](https://www.expressjs.com.cn/en/4x/api.html#app.use)将中间件指定为回调函数（有关详细信息，请参见[使用中间件](https://www.expressjs.com.cn/en/guide/using-middleware.html)）。

这些路由方法指定在应用程序收到对指定路由（端点）和HTTP方法的请求时调用的回调函数（有时称为“处理函数”）。换句话说，应用程序“侦听”与指定的路由和方法匹配的请求，并且当它检测到匹配项时，它将调用指定的回调函数。

实际上，路由方法可以具有多个回调函数作为参数。对于多个回调函数，重要的是提供`next`回调函数的参数，然后`next()`在函数体内调用以将控制权移交给下一个回调。

以下代码是一个非常基本的路由示例。

```javascript
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
```

#### 路由方法

route方法派生自其中一个HTTP方法，并附加到express类的实例。

以下代码是为GET和POST方法定义的到应用根目录的路由的示例。

```javascript
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
})
```

Express支持与所有HTTP请求方法相对应的方法：`get`，`post`等。有关完整列表，请参见[app.METHOD](https://www.expressjs.com.cn/en/4x/api.html#app.METHOD)。

有一种特殊的路由方法，`app.all()`用于为*所有*HTTP请求方法的路径加载中间件功能。例如，无论使用GET，POST，PUT，DELETE还是[http模块](https://nodejs.org/api/http.html#http_http_methods)支持的任何其他HTTP请求方法，都会对路由“ / secret”的请求执行以下处理程序。

```javascript
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})
```

#### 路由路径

路由路径，结合请求方法，定义了可以发出请求的端点。路由路径可以是字符串，字符串模式或正则表达式。

字符`?`，`+`，`*`，和`()`是他们的正则表达式的对应的子集。连字符（`-`）和点（`.`）由基于字符串的路径按字面意义解释。

如果请求请求路径中有美元字符`$`，请将其在 中`([`and `])`进行转义。例如，“ `/data/$book`”处用于请求的路径字符串将为“ `/data/([\$])book`”。

Express使用[path-to-regexp](https://www.npmjs.com/package/path-to-regexp)来匹配路由路径；有关定义路由路径的所有可能性，请参见正则表达式路径文档。[Express Route Tester](http://forbeslindesay.github.io/express-route-tester/)尽管不支持模式匹配，但却是用于测试基本Express路由的便捷工具。

注意：查询字符串不是路由路径的一部分。

以下是一些基于字符串的路由路径示例：

此路由路径会将请求匹配到根路由`/`。

```javascript
app.get('/', function (req, res) {
  res.send('root')
})
```

此路由路径会将请求匹配到`/about`。

```javascript
app.get('/about', function (req, res) {
  res.send('about')
})
```

此路由路径会将请求匹配到`/random.text`。

```javascript
app.get('/random.text', function (req, res) {
  res.send('random.text')
})
```

以下是一些基于字符串模式的路由路径示例。

此路由路径将与`acd`和匹配`abcd`。

```javascript
app.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})
```

这条路线的路径将会匹配`abcd`，`abbcd`，`abbbcd`，等等。

```javascript
app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
```

这条路线的路径将会匹配`abcd`，`abxcd`，`abRANDOMcd`，`ab123cd`，等。

```javascript
app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})
```

此路由路径将与`/abe`和匹配`/abcde`。

```javascript
app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
```

基于正则表达式的路由路径示例：

此路由路径将匹配其中带有“ a”的任何内容。

```javascript
app.get(/a/, function (req, res) {
  res.send('/a/')
})
```

这条路线的路径将匹配`butterfly`和`dragonfly`，但不`butterflyman`，`dragonflyman`等。

```javascript
app.get(/.*fly$/, function (req, res) {
  res.send('/.*fly$/')
})
```

####  路由参数——Route parameters

路由参数被命名为URL段，用于捕获URL中在其位置处指定的值。捕获的值将填充到`req.params`对象中，并将路径中指定的route参数的名称作为其各自的键。

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

要使用路由参数定义路由，只需在路由路径中指定路由参数，如下所示。

```javascript
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
```

路径参数的名称必须由（[A-Za-z0-9_]）组成。

由于连字符（`-`）和点（`.`）是按字面解释的，因此可以将它们与路由参数一起使用，以实现有用的目的。

```
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

要更好地控制可以由route参数匹配的确切字符串，可以在括号（`()`）后面附加一个正则表达式：

```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```

由于正则表达式通常在字符串中时，确保`\`使用其他反斜杠对所有字符进行转义，例如`\\d+`。即字符串中的`\\d+`表示正则表达式`\d+`

在Express 4.x中，[不以常规方式解释正则表达式中](https://github.com/expressjs/express/issues/2495)[的`*`字符](https://github.com/expressjs/express/issues/2495)。解决方法是，使用`{0,}`代替`*`。这可能会在Express 5中修复。

#### 路由处理（Route handles）

您可以提供行为类似于[中间件的](https://www.expressjs.com.cn/en/guide/using-middleware.html)多个回调函数来处理请求。唯一的例外是这些回调可能会调用`next('route')`以绕过其余的路由回调。您可以使用此机制在路由上施加先决条件，然后在没有理由继续使用当前路由的情况下将控制权传递给后续路由。

路由处理程序可以采用函数，函数数组或两者的组合的形式，如以下示例所示。

单个回调函数可以处理路由。例如：

```javascript
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
```

多个回调函数可以处理一条路由（请确保指定了`next`对象）。例如：

```javascript
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})
```

回调函数数组可以处理路由。例如：

```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

独立函数和函数数组的组合可以处理路由。例如：

```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
```

#### 响应方法——Response methods

`res`下表中响应对象（）上的方法可以向客户端发送响应，并终止请求-响应周期。如果没有从路由处理程序调用这些方法，则客户端请求将被挂起。

| 方法                                                         | 描述                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| [res.download()](https://www.expressjs.com.cn/en/4x/api.html#res.download) | 提示要下载的文件。                                     |
| [[res.end()](https://www.expressjs.com.cn/en/4x/api.html#res.end)](https://www.expressjs.com.cn/en/4x/api.html#res.end) | 结束响应过程。                                         |
| [res.json（）](https://www.expressjs.com.cn/en/4x/api.html#res.json) | 发送JSON响应。                                         |
| [res.jsonp（）](https://www.expressjs.com.cn/en/4x/api.html#res.jsonp) | 发送带有JSONP支持的JSON响应。                          |
| [res.redirect（）](https://www.expressjs.com.cn/en/4x/api.html#res.redirect) | 重定向请求。                                           |
| [res.render（）](https://www.expressjs.com.cn/en/4x/api.html#res.render) | 渲染视图模板。                                         |
| [res.send（）](https://www.expressjs.com.cn/en/4x/api.html#res.send) | 发送各种类型的响应。                                   |
| [res.sendFile（）](https://www.expressjs.com.cn/en/4x/api.html#res.sendFile) | 将文件作为八位字节流发送。                             |
| [res.sendStatus（）](https://www.expressjs.com.cn/en/4x/api.html#res.sendStatus) | 设置响应状态代码，并将其字符串表示形式发送为响应正文。 |

#### app.route（）

您可以使用来为路由路径创建可链接的路由处理程序`app.route()`。由于路径是在单个位置指定的，因此创建模块化路由非常有帮助，减少冗余和错别字也很有帮助。有关路由的更多信息，请参见：[Router（）文档](https://www.expressjs.com.cn/en/4x/api.html#router)。

这是使用定义的链式路由处理程序的示例`app.route()`。

```javascript
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```

#### express.Router

使用`express.Router`该类创建模块化的，可安装的路由处理程序。一个`Router`实例是一个完整的中间件和路由系统; 因此，它通常被称为“迷你应用程序”。

以下示例将路由器创建为模块，在其中加载中间件功能，定义一些路由，并将路由器模块安装在主应用程序的路径上。

`birds.js`在app目录中创建一个名为以下内容的路由器文件：

```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
```

然后，在应用程序中加载路由器模块：

```javascript
var birds = require('./birds')

// ...

app.use('/birds', birds)
```

该应用程序现在将能够处理对`/birds`和的请求`/birds/about`，以及调用`timeLog`特定于该路线的中间件功能。