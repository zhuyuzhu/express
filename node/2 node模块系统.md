# node模块系统

## 一 、核心模块 

**1、fs**

2、http

3、path

4、url 路径

5、os操作系统信息 

## 二、第三方模块

1、art-template

三、CommonJs规范

- 模块作用域

- require导入和module.exports、exports

  require可以加载核心模块，导入模块；加载规则：先判断是不是系统核心模块，如果不是，就按第三方js库的方式去加载；自定义js文件和前面两种的引入是需要路径，而不是仅仅只有名字。

  比如fs、每个js文件需要使用系统模块时，都要require

  自己的js、每个js模块文件加载的第一个次会被执行且缓存，后续加载该模块时，是从缓存中拿去的，所以只是获取模块的对象和内容。

  第三方js库、比如art-template.js  node中，

  ```javascript
  var template = require("art-template")
  ```

  + 第三方包名肯定唯一且不重复的

  + 寻找第三方包模块时，从当前文件夹往上级寻找一个node_modules文件夹，再找node_modules/art-template；再找art-template/pakeage.json文件中的main属性：对应的js文件

    ```javascript
    "main": "index.js",
    ```

    如果没有main属性，默认加载art-template/下的index.js

  如果还没有找到，再往上找node_modules文件夹。

  

  exports和module.exports的详细展开理解，索引地址指向问题

  ```javascript
  module.exports === exports
  ```

- 文章：www.infoq.com/cn/articles/nodejs-module-mechanism 深入浅出nodejs模块机制，相关文章看一下，需要其他文章深入理解。

  ### npm：node package manager  node包管理器

  ```javascript
  npm install art-template --save
  npm install --save art-template
  放前放后都可以
  ```

  关于package.json  package-lock.json等文件的理解。。。

  npm init  初始化项目   `npm init -y / --yes `跳过项目说明文件的填写直接创建项目

  npm install  根据package和package-lock.json来下载对应的依赖包  

  npm run "javascript":属性对应的命令；运行对应的命令对项目进行管理

  `dependencies`依赖包

  npm install 包名：只下载包，而没有保存到项目的依赖项中。  ——  `npm uninstall 包名`，只删除，但是依赖项中任存在依赖。

  npm下载包的时候，建议都加上`--save`这样会添加到`dependencies`依赖项中， npm install时会依据`dependencies`来下载依赖项。—— `npm uninstall --save 包名`：删除且从依赖项中移除。===  npm un -S 包名

- npm网站：www.npmjs.com   比如：jquery、bootstrap前端，以及node的express

- npm查看版本：`npm --version`

- npm升级：自己升级自己，`npm install --global npm` 全局安装

- `npm i -S` 包名 下载依赖包

切仓库

**npm的命令需要深入了解一下** 

```html
npm --help
npm 命令(install) --help ：具体某个命令的使用帮助
```

- npm被墙的问题：

  http://npm.taobao.org/  npm在国内做的备份，好像是每十分钟就更新一次。

  ```html
  npm install --global cnpm
  ```

  如果不想安装淘宝镜像，又想使用`cnpm`

  ```html
  npm install jquery --registry=https://registry.npm.taobao.org
  ```

  也可以直接配置，使得`npm`使用淘宝镜像：

  ```html
  npm config set registry https://registry.npm.taobao.org
  ```

  查看npm 配置信息，看registry是否被配置：

  ```html
  npm config list
  ```

- node中的package.json 和package-lock.json

- 

#### 关于路径问题

- / 代表根目录
- fs操作文件时，相对路径是针对开启终端的js文件；两个全局变量--文件的绝对路径，可以用在这里。。`__dirname`

```html
fs.readFile("文件路径", function(err, data){

})
```



### Path

- path.basename
  + 获取路径文件名和扩展名，比如：index.js
- path.dirname
  + 获取路径目录部分
- path.extname
  - 获取扩展名
- path.parse
  - 把一个路径转为对象
    + root  根目录
    + dir    目录
    + base  包含后缀的文件名
    + ext   后缀名
    + name  不包含后缀的文件名
- path.join
  - 拼接路径
- path.isAbsolute
  - 判断路径是否是绝对路径



#### `__dirname` 和 `__filename`

文件的绝对 路径

fs操作 文件时，相对路径是相对控制台的，所以会导致文件的获取的不准，不是相对于当前 文件，而是相对控制台。



#### 







