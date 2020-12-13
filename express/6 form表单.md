# form表单

以实例来讲解

地址：`http://localhost/views/form.html`

地址对应的html

```html
    <form action="/getform" method="GET" accept-charset="UTF-8"
     enctype="application/x-www-form-urlencoded" target="_self" name="form1"
     autocomplete="on" >
        First name: <input type="text" name="fname" /><br />
        Last name: <input type="text" name="lname" /><br />
        <input type="submit" value="Submit" />
      </form>
```

**1、action属性：提交请求的地址**

`action="/getform"`

提交地址：服务器根路径下的getform地址。

```js
http://localhost/getform?fname=admin1&lname=123456
```



`action="getform"`  或`action="./getform"`

提交地址：当前路径下的getform地址

```
http://localhost/views/getform?fname=admin1&lname=123456
```



**2、method属性：GET | POST**

浏览器使用 method 属性设置的方法将表单中的数据传送给服务器进行处理。共有两种方法：POST 方法和 GET 方法。

如果采用 POST 方法，浏览器将会按照下面两步来发送数据。首先，浏览器将与 action 属性中指定的表单处理服务器建立联系，一旦建立连接之后，浏览器就会按分段传输的方法将数据发送给服务器。

在服务器端，一旦 POST 样式的应用程序开始执行时，就应该从一个标志位置读取参数，而一旦读到参数，在应用程序能够使用这些表单值以前，必须对这些参数进行解码。用户特定的服务器会明确指定应用程序应该如何接受这些参数。

另一种情况是采用 GET 方法，这时浏览器会与表单处理服务器建立连接，然后直接在一个传输步骤中发送所有的表单数据：浏览器会将数据直接附在表单的 action URL 之后。这两者之间用问号进行分隔。

一般浏览器通过上述任何一种方法都可以传输表单信息，而有些服务器只接受其中一种方法提供的数据。可以在 <form> 标签的 method （方法）属性中指明表单处理服务器要用方法来处理数据，使 POST 还是 GET。

post请求：

```html
    <form action="/getform" method="POST" accept-charset="UTF-8"
     enctype="application/x-www-form-urlencoded" target="_self" name="form1"
     autocomplete="on" >
        First name: <input type="text" name="fname" /><br />
        Last name: <input type="text" name="lname" /><br />
        <input type="submit" value="Submit" />
      </form>
```

node和express对post的解码类型`application/json`和`application/x-www-form-urlencoded`不支持。需要借助中间件`body-parser`

```js
//引入body-parser
var bodyParser = require('body-parser')

//配置中间件，可以解析application/x-www-form-urlencoded类型
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//配置中间件，可以解析application/json类型
// parse application/json
app.use(bodyParser.json())

app.post('/getform', (req, res) => {
    res.end(JSON.stringify(req.body))
})
```

**3、accept-charset属性：规定服务器用哪种字符集处理表单数据。**

accept-charset的值：

- UTF-8 - Unicode 字符编码
- ISO-8859-1 - 拉丁字母表的字符编码
- gb2312 - 简体中文字符集

**4、enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码**

默认地，表单数据会编码为 "application/x-www-form-urlencoded"。就是说，在发送到服务器之前，所有字符都会进行编码（空格转换为 "+" 加号，特殊符号转换为 ASCII HEX 值）。

| 值                                | 描述                                                         |
| :-------------------------------- | :----------------------------------------------------------- |
| application/x-www-form-urlencoded | 在发送前编码所有字符（默认）                                 |
| multipart/form-data               | 不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。 |
| text/plain                        | 空格转换为 "+" 加号，但不对特殊字符编码。                    |

**5、target 属性规定在何处打开 action URL**

| 值          | 描述                       |
| :---------- | :------------------------- |
| _blank      | 在新窗口中打开。           |
| **_self**   | 默认。在相同的框架中打开。 |
| _parent     | 在父框架集中打开。         |
| _top        | 在整个窗口中打开。         |
| *framename* | 在指定的框架中打开。       |

**6、name 属性规定表单的名称。**

form 元素的 name 属性提供了一种在脚本中引用表单的方法。

#### HTML5属性：

**autocomplete 属性**：规定表单是否应该启用自动完成功能。

自动完成允许浏览器预测对字段的输入。当用户在字段开始键入时，浏览器基于之前键入过的值，应该显示出在字段中填写的选项。

**注释：**autocomplete 属性适用于 <form>，以及下面的 <input> 类型：text, search, url, telephone, email, password, datepickers, range 以及 color。

| 值   | 描述                         |
| :--- | :--------------------------- |
| on   | 默认。规定启用自动完成功能。 |
| off  | 规定禁用自动完成功能。       |

### 注意：

服务器重定向对异步请求无效。比如`res.redirect(/)`是无效的。只能通过前端来进行重定向`location.href`

