## mongoose

## node开发中需要连接mongoose

mongoose官网：https://mongoosejs.com/.

官方指南：http://mongoosejs.com/docs/guide.html

官方api文档 ：http://mongoosejs.com/docs/api.html

中文文档：http://www.mongoosejs.net/docs/index.html

MongoDB英文文档：https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/



MDN上mongoose文档：https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/mongoose



实例：

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{useMongoClient: true});

//监听连接数据库是否成功
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('success to  connect mongodb!')
});

//创建Schema，设计文档模型
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String
})
//根据Schema，设计集合内文档模型
var Blog = mongoose.model('Blog', blogSchema);//blogs集合

//根据模型创建具体文档
var documentBolg = new Blog({//创建文档
    title: "doc1"
})
//文档进行保存
documentBolg.save(function(err, data){//documentBolg文档进行保存，且调用对应的回到函数
    console.log(data);
})
```

>  mongoose.Schema构建Schema架构 ——  mongoose.model(集合名，Schema实例对象)  模型-- 用于创建多个文档对象的。

#### 安装依赖包：

```sh
$ npm install mongoose --save
```



### 连接Connections

参考文档：http://www.mongoosejs.net/docs/connections.html

使用 `mongoose.connect()` 方法连接 MongoDB。

这是连接到本地数据库默认接口(27017)的最小配置。

```javascript
mongoose.connect('mongodb://localhost/myapp');
```

还有别的连接方式。。。

`connect` 方法也接受 `options` 参数，这些参数会传入底层 MongoDB 驱动。

```javascript
mongoose.connect(uri, options);
```





### 设计Schema

中文参看文档：http://www.mongoosejs.net/docs/schematypes.html

英文文档：https://mongoosejs.com/docs/guide.html

##### 定义schema

Mongoose的一切都始于一个模式。每个模式都映射到一个MongoDB集合，并定义该集合中的文档的形状。

```javascript
  import mongoose from 'mongoose';
  const { Schema } = mongoose;

  const blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });
```

如果还想在blogSchema上添加额外的keys字段，使用Schema的add方法。

代码blogSchema中的每个键在文档中定义了一个被转换为与SchemaType相关联的属性，比如，我们定义的title属性将被转为SchemaType中的String类型，date属性将会被转换为SchemType中的Date类型。

注意上面代码中的title属性和date属性的差别，当只定义了属性type类型时，可以简写，如title属性。

键也可以被分配嵌套对象，其中包含更多的键/类型定义，就像上面的meta属性一样。当一个键的值是一个没有type属性的POJO时，就会发生这种情（POJO（Plain Ordinary Java Object）简单的Java对象，实际就是普通JavaBeans。

在这样的情况下，Mongoose 仅给主支属性创建路径，不会创建分支属性，比如上面的meta.votes和meta.favs，分支并没有实际的路径。这样做的一个副作用是，上面的meta不能有它自己的验证。如果meta上需要验证，需要在树中创建一条路径-参见子文档，有关如何进行此操作的更多信息。还请阅读SchemaTypes指南的Mixed小节以了解一些陷阱。

SchemaTypes有：

- [String](https://mongoosejs.com/docs/schematypes.html#strings)
- [Number](https://mongoosejs.com/docs/schematypes.html#numbers)
- [Date](https://mongoosejs.com/docs/schematypes.html#dates)
- [Buffer](https://mongoosejs.com/docs/schematypes.html#buffers)
- [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)
- [Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)
- [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)
- [Array](https://mongoosejs.com/docs/schematypes.html#arrays)
- [Decimal128](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Decimal128)
- [Map](https://mongoosejs.com/docs/schematypes.html#maps)



` be cast to`转换、associated  相关的、Notice above that注意到上面、permitted 允许，

**type两种方式：**

```js
var schema1 = new Schema({
  test: String // `test` is a path of type String
});

var schema2 = new Schema({
  test: { type: String } // `test` is a path of type string
});
```

schema的methods对象可以添加方法，可以每个实例document都可以继承该方法。

6秒再去连接数据库，进行数据操作。但是在未连接的状态下，schema是可以直接创建，不过等连接成功后，直接进行数据库的操作。添加的schema上的方法，是直接执行的。



```js
var mongoose = require('mongoose');

setTimeout(() => {
    mongoose.connect('mongodb://localhost/test',{useMongoClient: true});
}, 6000);

//监听连接数据库是否成功
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('success to  connect mongodb!')
});

//创建Schema，设计文档模型
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String
})
//在schema上添加方法，让documents继承
blogSchema.methods.func = function(){
    console.log('every document has a function')
}

//根据Schema，设计集合内文档模型
var Blog = mongoose.model('Blog', blogSchema);//blogs集合

//根据模型创建具体文档
var documentBolg = new Blog({//创建文档
    title: "doc1"
})
//文档进行保存
documentBolg.save(function(err, data){//documentBolg文档进行保存，且调用对应的回到函数
    console.log(data);
})

documentBolg.func();

```



除了 type 属性，你还可以对这个字段路径指定其他属性。 比如，在保存之前要把字母都改成小写：**`lowercase` 属性只作用于字符串。**

```js
var schema2 = new Schema({
  test: {
    type: String,
    lowercase: true // Always convert `test` to lowercase
  }
});
```

以下有一些全部 type 可用的选项和一些限定部分 type 使用的选项：

- `required`: 布尔值或函数 如果值为真，为此属性添加 [required 验证器](http://www.mongoosejs.net/docs/validation.html#built-in-validators)
- `default`: 任何值或函数 设置此路径默认值。如果是函数，函数返回值为默认值
- `select`: Boolean， 指定 query 的默认 [projections](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/)
- `validate`: function，为此属性添加验证器函数
- `get`: function， 使用 [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 定义自定义 getter
- `set`: function， 使用 [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 定义自定义 setter
- `alias`: 字符串 仅mongoose >= 4.10.0。 为gets/sets该字段定义[虚拟值](http://www.mongoosejs.net/docs/guide.html#virtuals) 

示例：

```js
var numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

var Number = mongoose.model('Number', numberSchema);

var doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
```

还可以给Schema某个字段设计成index索引：

- `index`: 布尔值 是否对这个属性创建[索引](https://docs.mongodb.com/manual/indexes/)
- `unique`: 布尔值 是否对这个属性创建[唯一索引](https://docs.mongodb.com/manual/core/index-unique/)
- `sparse`: 布尔值 是否对这个属性创建[稀疏索引](https://docs.mongodb.com/manual/core/index-sparse/)

示例：

```js
var schema2 = new Schema({
  test: {
    type: String,
    index: true,
    unique: true // Unique index. If you specify `unique: true`
    // specifying `index: true` is optional if you do `unique: true`
  }
});
```

Schema字段类型：

##### String

- `lowercase`: 布尔值 是否在保存前对此值调用 `.toLowerCase()`
- `uppercase`: 布尔值 是否在保存前对此值调用 `.toUpperCase()`
- `trim`: 布尔值 是否在保存前对此值调用 `.trim()`
- `match`: 正则表达式 创建[验证器](http://www.mongoosejs.net/docs/validation.html)检查这个值是否匹配给定正则表达式
- `enum`: 数组 创建[验证器](http://www.mongoosejs.net/docs/validation.html)检查这个值是否包含于给定数组

##### Number

- `min`: 数值 创建[验证器](http://www.mongoosejs.net/docs/validation.html)检查属性是否大于或等于该值
- `max`: 数值 创建[验证器](http://www.mongoosejs.net/docs/validation.html)检查属性是否小于或等于该值

##### Date

- `min`: Date
- `max`: Date



### 模型models



### 简单使用

model方法：





文档方法：

增 save方法



删

改

查

