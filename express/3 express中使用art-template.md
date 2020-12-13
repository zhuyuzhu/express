# express中使用art-template

node中除了art-template模板引擎，还有ejs。也挺出名。

### 安装：

express-art-template依赖art-template

```shell
npm install --save art-template
npm install --save express-art-template
```

### 使用：

1、我们应该在app.js配置express-art-template

如果文件目录结构如下，看看具体怎么使用

```
|——node
	——views
		——home
			home.html
		——template.html
	——routes
	——otherDir
	app.js
```



2、配置如下：

```javascript
//识别html文件
app.engine('html', require('express-art-template')); 
//设置参数配置
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production' //开启调试
});
//修改默认目录
app.set('views', path.join(__dirname, 'views'));
//设置加载文件类型
app.set('view engine', 'html'); 
```

开启调试：

art-template 内建调试器，能够捕获到语法与运行错误，并且支持自定义的语法。

在 NodeJS 中调试模式会根据环境变量自动开启：`process.env.NODE_ENV !== 'production'`

模板变量：

`template.defaults.imports`

模板通过 `$imports` 可以访问到模板外部的全局变量与导入的变量。

内置变量清单

- `$data` 传入模板的数据
- `$imports` 外部导入的变量以及全局变量
- `print` 字符串输出函数
- `include` 子模板载入函数
- `extend` 模板继承模板导入函数
- `block` 模板块声明函数

3、使用：

（1）会寻找配置views目录下的直接子文件

（2）res.render方法渲染视图模板，express的内部方法

```javascript
app.get('/', function (req, res) {
    res.render('template.html', {
        user: {
            name: 'aui',
            tags: ['art', 'template', 'nodejs']
        }
    });
});
```

4、如果想修改默认views文件夹的配置：修改为其他目录——当前app.js下的其他目录下的文件

```javascript
app.set('views', path.join(__dirname, 'otherDir')); //修改为其他目录——当前app.js下的其他目录下的文件
```

5、如果想获得views/home/home.html呢？不是直接子目录下，而是在子目录home下的文件？

```javascript
app.get('/', function (req, res) {
    res.render('home/home.html', {
        user: {
            name: 'aui',
            tags: ['art', 'template', 'nodejs']
        }
    });
});
```

### 模板继承（block插槽  extend继承）

**1、参考官网**：http://aui.github.io/art-template/zh-cn/docs/syntax.html#%E6%A8%A1%E6%9D%BF%E7%BB%A7%E6%89%BF

**2、原理**

后端node在获取这个html页面的字符串，（包括需要的css、js），首屏页面，发送给前端后，浏览器才会对html文件进行渲染。

**3、使用：**

在layout.html中，内部可以使用插槽block。

特点：extend继承者可以在此处插入自己的内容。如果没有内容，将显示默认内容

```
{{block 'tagname'}} 
	<!-- 插入默认内容 -->
	<span>我是默认内容</span>
{{/block}}
```

注意：可以在layout.html 模板文件的任何位置使用block，只要res.render渲染后的html是合理就可以。

**示例：**

```html
<!--layout.html-->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{block 'title'}}My Site{{/block}}</title>

    {{block 'head'}}
    <link rel="stylesheet" href="main.css">
    {{/block}}
</head>
<body>
    {{block 'content'}}{{/block}}
</body>
</html>
```

继承上面的html（预留了block），即继承了index.html的所有内容，也拥有了填充block内容的权利。

```html
<!--index.html-->
{{extend './layout.art'}}

{{block 'title'}}{{title}}{{/block}}

{{block 'head'}}
    <link rel="stylesheet" href="custom.css">
{{/block}}

{{block 'content'}}
<p>This is just an awesome page.</p>
{{/block}}
```

然后，`res.render`方法对index.html传入参数且进行渲染，会继承layout.html内容



### 子模板（引入子模板 include）

include引入文件，就可以将其内容填充到此处(include处) 。而在浏览器中，不能这么使用。

1、官网：

http://aui.github.io/art-template/zh-cn/docs/syntax.html#%E5%AD%90%E6%A8%A1%E6%9D%BF

2、使用

在html中的任何一处都可以直接使用

标准语法：

```html
{{include './header.html'}}
{{include './header.html' data}}
```

原始语法：

```
<% include('./header.art') %>
<% include('./header.art', data) %>
```

注意：数据值默认为$data。标准语法不支持对象和数组的声明，但支持引用变量的声明。但是，原始语法没有限制。

示例：index.html 中引入layout.html内容

```html
<!-- index.html -->	
<div>
    {{include './home1.html'}}
</div>
```

```html
<!-- layout.html -->
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

传入数据：index.html中引入layout.html，同时传给layout.html数据

```html
<!-- index.html -->
	<div>
        {{include './home1.html', ["a","b","c"] }}
	</div>
```

默认使用`$data`

```html
<!-- layout.html -->
<ul>
    {{each $data}}
    <li>{{$value}}</li>
    {{/each}}
</ul>
```







