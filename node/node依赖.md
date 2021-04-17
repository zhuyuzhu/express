# node依赖相关的知识

### require路径：

当前文件夹下：

```js
var a = require('./a.js')
```

从node_modules中查找：

```js
var a = require('a.js')
```

从node模块中查找：

```js
var path = require('path')
```



### node查找依赖包的原理：