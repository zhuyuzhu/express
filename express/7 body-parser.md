# body-parser

官网：https://github.com/expressjs/body-parser

介绍：Node.js body 解析的中间件，提供了以下解析能力：

- [JSON body parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions)
- [Raw body parser](https://github.com/expressjs/body-parser#bodyparserrawoptions)
- [Text body parser](https://github.com/expressjs/body-parser#bodyparsertextoptions)
- [URL-encoded form body parser](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)

还有一些其他的解析器：

- [body](https://www.npmjs.org/package/body#readme)
- [co-body](https://www.npmjs.org/package/co-body#readme)

安装：

```shell
$ npm install --save body-parser
```

引入：

```shell
var bodyParser = require('body-parser')
```

bodyParser对象公开了用于创建中间件的各种工厂。所有的中间件将填充请求。当内容类型请求头与类型选项匹配时，使用已解析主体的body属性;如果没有要解析的主体，则为空对象({})，内容类型没有匹配，或发生错误

### bodyParser.json([options])

https://github.com/expressjs/body-parser#bodyparserjsonoptions

返回中间件，该中间件只解析json并只查看内容类型头与类型选项匹配的请求。该解析器接受主体的任何Unicode编码，并支持gzip的自动膨胀和deflate编码。

### bodyParser.urlencoded([options])

https://github.com/expressjs/body-parser#bodyparserurlencodedoptions

### bodyParser.text([options])

https://github.com/expressjs/body-parser#bodyparsertextoptions

### bodyParser.raw([options])

https://github.com/expressjs/body-parser#bodyparserrawoptions



### 使用：

#### Express/Connect top-level generic

这个例子演示了添加 JSON and URL-encoded解析能力的高阶中间件。它将解析所有传入请求的body。以下是一个简单的设置：

```js
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

#### Express route-specific

这个例子演示了如何将body解析器添加到需要它们的路由中。一般来说，这是与Express一起使用主体解析器的最推荐的方法。

```js
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
})
```



#### 改变解析类型：

所有的解析方法都接收一个`type`，允许你去改变这个中间件将要解析的`Content-Type`内容类型

```js
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))
```

