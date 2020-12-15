# Model

[TOC] 

**在开发和学习的过程中，不断完善该文档！**

### [Model()](https://mongoosejs.com/docs/api/model.html#model_Model)

Model是一个类，它是与MongoDB交互的主要工具。Model的实例称为文档。

在mongoose中，术语Model是`mongoose.Model`的子类，不能直接使用`mongoose.Model`类，正如下面的例子，通过`mongoose.model` 和 `connection.model`方法去创建一个子类。

```js
// `UserModel` is a "Model", a subclass of `mongoose.Model`.
const UserModel = mongoose.model('User', new Schema({ name: String }));

// You can use a Model to create new documents using `new`:
const userDoc = new UserModel({ name: 'Foo' });
await userDoc.save();

// You also use a model to create queries:
const userFromDb = await UserModel.findOne({ name: 'Foo' });
```

### [Model.aggregate()](https://mongoosejs.com/docs/api/model.html#model_Model.aggregate)

对模型集合执行聚合。如果传递回调函数，则执行聚合并返回Promise。如果没有传递回调，则返回聚合本身。此函数触发`aggregate()`中间件。

```js
// Find the max balance of all accounts
Users.aggregate([
  { $group: { _id: null, maxBalance: { $max: '$balance' }}},
  { $project: { _id: 0, maxBalance: 1 }}
]).
then(function (res) {
  console.log(res); // [ { maxBalance: 98000 } ]
});

// Or use the aggregation pipeline builder.
Users.aggregate().
  group({ _id: null, maxBalance: { $max: '$balance' } }).
  project('-id maxBalance').
  exec(function (err, res) {
    if (err) return handleError(err);
    console.log(res); // [ { maxBalance: 98 } ]
  })
```

注意：

Mongoose不会将聚合管道强制转换为模型的模式，因为$project和$group操作符允许在管道的任何阶段重新定义文档的“形状”，这可能会留下不兼容的文档格式。您可以使用mongoose-cast-aggregation插件来为聚合管道启用最小的类型转换。

返回的文档是纯javascript对象，而不是mongoose文档(因为可以返回任何形状的文档)。

更多关系聚合的信息：

- [Mongoose `Aggregate`](https://mongoosejs.com/docs/api/aggregate.html)
- [介绍 Mongoose Aggregate](https://masteringjs.io/tutorials/mongoose/aggregate)
- [MongoDB Aggregation 文档](http://docs.mongodb.org/manual/applications/aggregation/)

### [Model.bulkWrite()](https://mongoosejs.com/docs/api/model.html#model_Model.bulkWrite)

在一个命令中向MongoDB服务器发送多个insertOne、updateOne、updateMany、replaceOne、deleteOne和/或deleteMany操作。这比发送多个独立操作要快(例如，如果你使用create())，因为使用bulkWrite()，到MongoDB只有一次往返。

Mongoose 将会执行你提供的所有操作。

这个函数不触发任何中间件，既不触发save()，也不触发update()。如果你需要为每个文档触发save()中间件，可以使用create()。

```js
Character.bulkWrite([
  {
    insertOne: {
      document: {
        name: 'Eddard Stark',
        title: 'Warden of the North'
      }
    }
  },
  {
    updateOne: {
      filter: { name: 'Eddard Stark' },
      // If you were using the MongoDB driver directly, you'd need to do
      // `update: { $set: { title: ... } }` but mongoose adds $set for
      // you.
      update: { title: 'Hand of the King' }
    }
  },
  {
    deleteOne: {
      {
        filter: { name: 'Eddard Stark' }
      }
    }
  }
]).then(res => {
 // Prints "1 1 1"
 console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
});
```

支持的操作有:

- `insertOne`
- `updateOne`
- `updateMany`
- `deleteOne`
- `deleteMany`
- `replaceOne`

### [Model.cleanIndexes()](https://mongoosejs.com/docs/api/model.html#model_Model.cleanIndexes)

删除所有没有在此模型的schema中定义的索引。使用syncIndexes()。

返回的promise解析为被删除索引的名称列表作为数组。



### [Model.count()](https://mongoosejs.com/docs/api/model.html#model_Model.count)

对数据库集合中与筛选器匹配的文档数进行计数。

不建议使用此方法。如果你想计数一个集合中的文档数量，例如count({})，可以使用estimatedDocumentCount()函数。否则，请使用countDocuments()函数。

```js
Adventure.count({ type: 'jungle' }, function (err, count) {
  if (err) ..
  console.log('there are %d jungle adventures', count);
});
```



### [Model.countDocuments()](https://mongoosejs.com/docs/api/model.html#model_Model.countDocuments)

对数据库集合中匹配筛选器的文档数进行计数。

```js
Adventure.countDocuments({ type: 'jungle' }, function (err, count) {
  console.log('there are %d jungle adventures', count);
});
```

如果想要计算大型集合中的所有文档，可以使用estimatedDocumentCount()函数。如果调用countDocuments({})， MongoDB将始终执行完整的集合扫描，而不使用任何索引。countDocuments()函数类似于count()，但是有几个countDocuments()不支持的操作符。下面是count()支持但countDocuments()不支持的操作符，以及建议的替换:

- `$where`: [`$expr`](https://docs.mongodb.com/manual/reference/operator/query/expr/)
- `$near`: [`$geoWithin`](https://docs.mongodb.com/manual/reference/operator/query/geoWithin/) with [`$center`](https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center)
- `$nearSphere`: [`$geoWithin`](https://docs.mongodb.com/manual/reference/operator/query/geoWithin/) with [`$centerSphere`](https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere)

### [Model.create()](https://mongoosejs.com/docs/api/model.html#model_Model.create)

将一个或多个文档保存到数据库的快捷方式。MyModel.create(docs)为docs中的每个doc创建新的MyModel(doc).save()。

此函数触发`save()`中间件。

```js
// Insert one new `Character` document
await Character.create({ name: 'Jean-Luc Picard' });

// Insert multiple new `Character` documents
await Character.create([{ name: 'Will Riker' }, { name: 'Geordi LaForge' }]);

// Create a new character within a transaction. Note that you **must**
// pass an array as the first parameter to `create()` if you want to
// specify options.
await Character.create([{ name: 'Jean-Luc Picard' }], { session });
```

### [Model.createCollection()](https://mongoosejs.com/docs/api/model.html#model_Model.createCollection)

为这个模型创建集合。默认情况下，如果没有指定索引，mongoose将不会为模型创建集合，直到创建任何文档。使用此方法显式创建集合。

您可能需要在启动事务之前调用它：https://docs.mongodb.com/manual/core/transactions/#transactions-and-operations

如果您的架构包含索引或惟一字段，则不必调用它。在这种情况下, 可以使用Model.init()

```js
const userSchema = new Schema({ name: String })
const User = mongoose.model('User', userSchema);

User.createCollection().then(function(collection) {
  console.log('Collection is created!');
})
```

### [Model.createIndexes()](https://mongoosejs.com/docs/api/model.html#model_Model.createIndexes)

类似于ensureIndexes()，除了它使用createIndex函数。



### [Model.deleteMany()](https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany)

从集合中删除符合条件的所有文档。行为类似于remove()，但是删除所有符合条件的文档，而不管单个选项。

```js
await Character.deleteMany({ name: /Stark/, age: { $gte: 18 } });
```

这个函数触发deleteMany查询钩子。阅读中间件文档[middleware docs](https://mongoosejs.com/docs/middleware.html#naming) 了解更多信息。

### [Model.deleteOne()](https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne)

从集合中删除与条件匹配的第一个文档。行为类似于remove()，但不管单个选项如何，最多删除一个文档。

```js
await Character.deleteOne({ name: 'Eddard Stark' });
```

这个函数触发deleteOne查询钩子。阅读中间件文档[middleware docs](https://mongoosejs.com/docs/middleware.html#naming)了解更多信息。

### [Model.discriminator()](https://mongoosejs.com/docs/api/model.html#model_Model.discriminator)

添加鉴别器类型。

```js
function BaseSchema() {
  Schema.apply(this, arguments);

  this.add({
    name: String,
    createdAt: Date
  });
}
util.inherits(BaseSchema, Schema);

const PersonSchema = new BaseSchema();
const BossSchema = new BaseSchema({ department: String });

const Person = mongoose.model('Person', PersonSchema);
const Boss = Person.discriminator('Boss', BossSchema);
new Boss().__t; // "Boss". `__t` is the default `discriminatorKey`

const employeeSchema = new Schema({ boss: ObjectId });
const Employee = Person.discriminator('Employee', employeeSchema, 'staff');
new Employee().__t; // "staff" because of 3rd argument above
```

### [Model.distinct()](https://mongoosejs.com/docs/api/model.html#model_Model.distinct)

为不同的操作创建查询。传递回调函数执行查询。

```js
Link.distinct('url', { clicks: {$gt: 100}}, function (err, result) {
  if (err) return handleError(err);

  assert(Array.isArray(result));
  console.log('unique urls with more than 100 clicks', result);
})

const query = Link.distinct('url');
query.exec(callback);
```

### [Model.ensureIndexes()](https://mongoosejs.com/docs/api/model.html#model_Model.ensureIndexes)

为模式中声明的每个索引发送createIndex命令到mongo。createIndex命令是串行发送的。

```js
Event.ensureIndexes(function (err) {
  if (err) return handleError(err);
});
```

完成之后，在这个模型上触发一个索引事件，如果发生错误，则传递一个错误。

```js
const eventSchema = new Schema({ thing: { type: 'string', unique: true }})
const Event = mongoose.model('Event', eventSchema);

Event.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})
```

注意：不建议您在生产环境中运行它。根据负载的不同，索引创建可能会影响数据库性能。谨慎使用。

### [Model.estimatedDocumentCount()](https://mongoosejs.com/docs/api/model.html#model_Model.estimatedDocumentCount)

估计MongoDB集合中的文档数量。对于大型集合，它比使用countDocuments()要快，因为estimatedDocumentCount()使用集合元数据，而不是扫描整个集合。

```js
const numAdventures = Adventure.estimatedDocumentCount();
```

### [Model.events](https://mongoosejs.com/docs/api/model.html#model_Model-events)

报告发生的任何错误的事件发射器。用于全局错误处理。

```js
MyModel.events.on('error', err => console.log(err.message));

// Prints a 'CastError' because of the above handler
await MyModel.findOne({ _id: 'notanid' }).catch(noop);
```

### [Model.exists()](https://mongoosejs.com/docs/api/model.html#model_Model.exists)

如果数据库中至少存在一个与给定筛选器匹配的文档，则返回true，否则返回false。

在底层，MyModel.exists({ answer: 42 })等价于MyModel.findOne({ answer: 42 }).select({ _id: 1 }).lean().then(doc => !!doc)

```js
await Character.deleteMany({});
await Character.create({ name: 'Jean-Luc Picard' });

await Character.exists({ name: /picard/i }); // true
await Character.exists({ name: /riker/i }); // false
```

此函数触发`findOne()`中间件。

### [Model.find()](https://mongoosejs.com/docs/api/model.html#model_Model.find)

查找文档。

Mongoose在发送命令之前强制转换过滤器以匹配模型的模式。有关Mongoose如何投射过滤器的更多信息，请参阅我们的查询投射教程。

```js
// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();
```

### [Model.findById()](https://mongoosejs.com/docs/api/model.html#model_Model.findById)

根据其_id字段查找单个文档。findById(id)几乎等同于findOne({_id: id})。如果你想通过文档的_id查询，使用findById()而不是findOne()。

在发送命令之前，将根据模式强制转换id。

此函数的触发根据`findone`中间件 。

除了它如何处理未定义。如果您使用findOne()，您将看到findOne(undefined)和findOne({_id: undefined})与findOne({})是等价的，并返回任意文档。然而，mongoose将findById(undefined)翻译成findOne({_id: null})。

```js
// Find the adventure with the given `id`, or `null` if not found
await Adventure.findById(id).exec();

// using callback
Adventure.findById(id, function (err, adventure) {});

// select only the adventures name and length
await Adventure.findById(id, 'name length').exec();
```

### [Model.findByIdAndDelete()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndDelete)

通过文档的_id字段发出MongoDB findOneAndDelete()命令。换句话说，findByIdAndDelete(id)是findOneAndDelete({_id: id})的简写。

该函数的触发依赖`findOneAndDelete()`中间件。

### [Model.findByIdAndRemove()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove)

通过文档的_id字段发出mongodb findAndModify删除命令。findByIdAndRemove(id，…)等价于findOneAndRemove({_id: id}，…)

找到匹配的文档，删除它，将找到的文档(如果有的话)传递给回调。

如果传递回调，则执行查询。

此函数触发以下中间件。

- `findOneAndRemove()`

选项：

+ sort 如果条件中发现多个文档，则设置排序顺序以选择要更新的文档
+ select 设置要返回的文档字段
+ rawResult 如果为true，返回MongoDB驱动的原始结果
+ strict 重写此更新的架构的严格模式选项

```js
A.findByIdAndRemove(id, options, callback) // executes
A.findByIdAndRemove(id, options)  // return Query
A.findByIdAndRemove(id, callback) // executes
A.findByIdAndRemove(id) // returns Query
A.findByIdAndRemove()           // returns Query
```

### [Model.findByIdAndUpdate()](https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate)

通过文档的_id字段发出mongodb findAndModify更新命令。findByIdAndUpdate(id，…)等价于findOneAndUpdate({_id: id}，…)

找到匹配的文档，根据update arg更新它，传递任何选项，并将找到的文档(如果有的话)返回回调。如果传递回调，则执行查询。

此函数触发以下中间件。

- `findOneAndUpdate()`

选项 ：

- new：bool -返回修改后的文档而不是原始文档。默认值为假
- upsert：bool—如果对象不存在，创建该对象。默认值为false。
- runValidators：如果为true，则在此命令上运行更新验证器。更新验证器根据模型的模式验证更新操作。
- setDefaultsOnInsert：如果setDefaultsOnInsert和upsert为true，那么当创建一个新文档时，mongoose将应用模型模式中指定的默认值。这个选项只适用于MongoDB >= 2.4，因为它依赖于MongoDB的$setOnInsert操作符
- sort：如果条件中发现多个文档，则设置排序顺序以选择要更新的文档
- select：设置要返回的文档字段
- rawResult：如果为true，返回MongoDB驱动的原始结果
- strict：重写此更新的架构的严格模式选项

```js
A.findByIdAndUpdate(id, update, options, callback) // executes
A.findByIdAndUpdate(id, update, options)  // returns Query
A.findByIdAndUpdate(id, update, callback) // executes
A.findByIdAndUpdate(id, update)           // returns Query
A.findByIdAndUpdate()   
```

注意：所有非`atomic`操作名称的顶级update键都被视为set操作:

```js
Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)

// is sent as
Model.findByIdAndUpdate(id, { $set: { name: 'jason bourne' }}, options, callback)
```

这有助于防止意外地覆盖您的文档，使用{ name: 'jason bourne' }

注意：

当使用findAndModify帮助程序时，值被强制转换为它们适当的类型。但是，默认情况下不执行下面的操作。

默认值。使用setDefaultsOnInsert选项来覆盖。

findAndModify助手支持有限的验证。您可以通过分别设置runValidators选项来启用它们。

如果需要完整的验证，请使用首先检索文档的传统方法。

```js
Model.findById(id, function (err, doc) {
  if (err) ..
  doc.name = 'jason bourne';
  doc.save(callback);
});
```

### [Model.findOne()](https://mongoosejs.com/docs/api/model.html#model_Model.findOne)

在发送命令之前，条件被转换为它们各自的模式类型。

注意:条件是可选的，如果条件是空的或未定义的，mongoose将发送一个空的findOne命令到MongoDB，它将返回一个任意文档。如果要按_id查询，则使用findById()。

```js
// Find one adventure whose `country` is 'Croatia', otherwise `null`
await Adventure.findOne({ country: 'Croatia' }).exec();

// using callback
Adventure.findOne({ country: 'Croatia' }, function (err, adventure) {});

// select only the adventures name and length
await Adventure.findOne({ country: 'Croatia' }, 'name length').exec();
```

### [Model.findOneAndDelete()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndDelete)

发出MongoDB findOneAndDelete()命令。

找到匹配的文档，删除它，并将找到的文档(如果有的话)传递给回调。

如果传递回调，则执行查询。

此函数触发以下中间件。

- `findOneAndDelete()`

这个函数与Model.findOneAndRemove()略有不同，findOneAndRemove()变成了MongoDB的findAndModify()命令，而不是findOneAndDelete()命令。对于大多数mongoose用例来说，这种区别纯粹是卖弄学问。您应该使用findOneAndDelete()，除非您有很好的理由不使用它。

选项：

- sort：如果条件中发现多个文档，则设置排序顺序以选择要更新的文档
- maxTimeMS：设置查询的时间限制-要求mongodb >= 2.6.0
- select：设置文档字段返回，例如。{ projection: { _id: 0 } }
- projection：等价于 select
- rawResult：如果为true，返回MongoDB驱动的原始结果
- strict：重写此更新的架构的严格模式选项

```js
A.findOneAndDelete(conditions, options, callback) // executes
A.findOneAndDelete(conditions, options)  // return Query
A.findOneAndDelete(conditions, callback) // executes
A.findOneAndDelete(conditions) // returns Query
A.findOneAndDelete()           // returns Query
```

当使用findAndModify帮助程序时，值被强制转换为它们适当的类型。但是，默认情况下不执行下面的操作。

默认，使用setDefaultsOnInsert选项来覆盖。

findAndModify助手支持有限的验证。您可以通过分别设置runValidators选项来启用它们。

如果需要完整的验证，请使用首先检索文档的传统方法。

```js
Model.findById(id, function (err, doc) {
  if (err) ..
  doc.name = 'jason bourne';
  doc.save(callback);
});
```

### [Model.findOneAndRemove()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndRemove)

发出一个mongodb findAndModify删除命令。

找到一个匹配的文档，删除它，将找到的文档(如果有的话)传递给callback。

如果传递回调，则执行查询。

此函数触发以下中间件。

- `findOneAndRemove()`

选项：

- 如果条件中发现多个文档，则设置排序顺序以选择要更新的文档
- 设置查询的时间限制-要求mongodb >= 2.6.0
- 设置要返回的文档字段
- 像select一样，它决定返回哪些字段，例如，{ projection: { _id: 0 } }
- 如果为true，返回MongoDB驱动的原始结果
- 重写此更新的架构的严格模式选项[strict mode option](http://mongoosejs.com/docs/guide.html#strict)

```js
A.findOneAndRemove(conditions, options, callback) // executes
A.findOneAndRemove(conditions, options)  // return Query
A.findOneAndRemove(conditions, callback) // executes
A.findOneAndRemove(conditions) // returns Query
A.findOneAndRemove()           // returns Query
```

当使用findAndModify帮助程序时，值被强制转换为它们适当的类型。但是，默认情况下不执行下面的操作。

默认 ，使用setDefaultsOnInsert选项来覆盖。

findAndModify助手支持有限的验证。您可以通过分别设置runValidators选项来启用它们。

如果需要完整的验证，请使用首先检索文档的传统方法。

```js
Model.findById(id, function (err, doc) {
  if (err) ..
  doc.name = 'jason bourne';
  doc.save(callback);
});
```

### [Model.findOneAndReplace()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndReplace)

发出MongoDB findOneAndReplace()命令。

找到匹配的文档，用提供的文档替换它，并将返回的文档传递给回调。

如果传递回调，则执行查询。

此函数触发以下查询中间件。

- `findOneAndReplace()`

选项：

- sort：如果条件发现多个文档，则设置排序顺序，选择哪个文档作为upda文档
- maxTimeMS：置查询的时间限制-要求mongodb >= 2.6.0
- select：设置要返回的文档字段
- projection：像select一样，它决定返回哪些字段，例如，{ projection: { _id: 0 } }
- rawResult：如果为true，返回MongoDB驱动的原始结果
- strict：重写此更新的架构的严格模式选项

```js
A.findOneAndReplace(conditions, options, callback) // executes
A.findOneAndReplace(conditions, options)  // return Query
A.findOneAndReplace(conditions, callback) // executes
A.findOneAndReplace(conditions) // returns Query
A.findOneAndReplace()           // returns Query
```

当使用findAndModify帮助程序时，值被强制转换为它们适当的类型。但是，默认情况下不执行下面的操作。

默认：使用setDefaultsOnInsert选项来覆盖。

### [Model.findOneAndUpdate()](https://mongoosejs.com/docs/api/model.html#model_Model.findOneAndUpdate)

发出mongodb findAndModify更新命令。

找到匹配的文档，根据update arg更新它，传递任何选项，并将找到的文档(如果有的话)返回回调。如果传递回调函数，则查询执行，否则查询对象返回

选项：

- new：bool -如果为true，返回修改后的文档而不是原始文档。默认为false(在4.0中改变)
- upsert：bool—如果对象不存在，创建该对象。默认值为false。
- overwrite：bool -如果为true，替换整个文档。
- fields：{Object|String} -字段选择。相当于.select(fields).findOneAndUpdate()
- maxTimeMS：设置查询的时间限制-要求mongodb >= 2.6.0
- sort：如果条件中发现多个文档，则设置排序顺序以选择要更新的文档
- runValidators：如果为true，则在此命令上运行更新验证器。更新验证器根据模型的模式验证更新操作。
- setDefaultsOnInsert：如果这个和upsert为true，那么当创建一个新文档时，mongoose将应用模型模式中指定的默认值。这个选项只适用于MongoDB >= 2.4，因为它依赖于MongoDB的$setOnInsert操作符。
- rawResult：如果为true，返回MongoDB驱动的原始结果
- strict：重写此更新的架构的严格模式选项

```js
A.findOneAndUpdate(conditions, update, options, callback) // executes
A.findOneAndUpdate(conditions, update, options)  // returns Query
A.findOneAndUpdate(conditions, update, callback) // executes
A.findOneAndUpdate(conditions, update)           // returns Query
A.findOneAndUpdate()                             // returns Query
```

注意：所有非`atomic`操作名称的顶级update键都被视为set操作，比如：

```js
const query = { name: 'borne' };
Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

// is sent as
Model.findOneAndUpdate(query, { $set: { name: 'jason bourne' }}, options, callback)
```

这有助于防止意外地用{name: 'jason bourne'}覆盖您的文档。

注意 ：

当使用findAndModify帮助程序时，值被强制转换为它们适当的类型。但是，默认情况下不执行下面的操作。

默认 ，使用setDefaultsOnInsert选项来覆盖。

findAndModify助手支持有限的验证。您可以通过分别设置runValidators选项来启用它们。

如果需要完整的验证，请使用首先检索文档的传统方法。

```js
Model.findById(id, function (err, doc) {
  if (err) ..
  doc.name = 'jason bourne';
  doc.save(callback);
});
```

### [Model.geoSearch()](https://mongoosejs.com/docs/api/model.html#model_Model.geoSearch)

为Mongoose实现$geoSearch功能，此函数不会触发任何中间件。

```js
const options = { near: [10, 10], maxDistance: 5 };
Locations.geoSearch({ type : "house" }, options, function(err, res) {
  console.log(res);
});
```

选项：

- near：{Array} x,y指向搜索
- maxDistance：{Number}距离结果附近点的最大距离
- limit：{Number}返回的最大结果数
- `lean` ：{Object|Boolean}返回原始对象，而不是Mongoose模型

### [Model.hydrate()](https://mongoosejs.com/docs/api/model.html#model_Model.hydrate)

从现有的原始数据创建新文档的快捷方式，预先保存在数据库中。返回的文档没有标记为最初修改的路径。

```js
// hydrate previous data into a Mongoose document
const mongooseCandy = Candy.hydrate({ _id: '54108337212ffb6d459f854c', type: 'jelly bean' });
```

### [Model.init()](https://mongoosejs.com/docs/api/model.html#model_Model.init)

除非关闭自动索引，否则这个函数负责构建索引。

当使用Mongoose .model()或connection.model()创建模型时，Mongoose会自动调用这个函数，所以你不需要调用它。这个函数也是幂等的，所以你可以调用它来获得一个promise，它将在你的索引完成构建时解析，作为MyModel.on('index')的替代方法。

```js
const eventSchema = new Schema({ thing: { type: 'string', unique: true }})
// This calls `Event.init()` implicitly, so you don't need to call
// `Event.init()` on your own.
const Event = mongoose.model('Event', eventSchema);

Event.init().then(function(Event) {
  // You can also use `Event.on('index')` if you prefer event emitters
  // over promises.
  console.log('Indexes are done building!');
});
```

### [Model.insertMany()](https://mongoosejs.com/docs/api/model.html#model_Model.insertMany)

验证文档数组并将它们插入MongoDB(如果它们都是有效的)的快捷方式。这个函数比.create()快，因为它只向服务器发送一个操作，而不是针对每个文档发送一个操作。

Mongoose总是在将insertMany发送到MongoDB之前验证每个文档。因此，如果一个文档有验证错误，那么将不会保存任何文档，除非您将ordered选项设置为false。

此函数不会触发保存中间件。

此函数触发以下中间件。

- `insertMany()`

```js
const arr = [{ name: 'Star Wars' }, { name: 'The Empire Strikes Back' }];
Movies.insertMany(arr, function(error, docs) {});
```

### [Model.inspect()](https://mongoosejs.com/docs/api/model.html#model_Model.inspect)

console.log助手。给定一个名为'MyModel'的模型，返回字符串' model {MyModel}'

```js
const MyModel = mongoose.model('Test', Schema({ name: String }));
MyModel.inspect(); // 'Model { Test }'
console.log(MyModel); // Prints 'Model { Test }'
```

### [Model.listIndexes()](https://mongoosejs.com/docs/api/model.html#model_Model.listIndexes)

列出MongoDB中当前定义的索引。这可能与您的模式中定义的索引相同，也可能不同，这取决于您是否使用autoIndex选项以及您是否手动构建索引。

### [Model.mapReduce()](https://mongoosejs.com/docs/api/model.html#model_Model.mapReduce)

执行mapReduce命令。o是指定所有mapReduce选项以及map和reduce函数的对象。所有选项都委托给驱动程序实现。关于选项的更多细节，请参阅node-mongodb-native mapReduce()文档。此函数不会触发任何中间件。

```js
const o = {};
// `map()` and `reduce()` are run on the MongoDB server, not Node.js,
// these functions are converted to strings
o.map = function () { emit(this.name, 1) };
o.reduce = function (k, vals) { return vals.length };
User.mapReduce(o, function (err, results) {
  console.log(results)
})
```

选项：

- query：查询过滤器对象。
- sort：使用此键对输入对象进行排序
- limit：文件的最大数量
- keeptemp：保存临时数据
- finalize：完成功能
- scope：在执行过程中暴露给map/reduce/finalize的范围变量
- jsMode：可以让执行保持在JS中。提供在MongoDB > 2.0.X
- verbose：提供作业执行时间的统计信息。
- `readPreference` {String}
- `out*` {Object, default: {inline:1}} 设置map reduce作业的输出目标。

*out 选项：

-  {inline:1}：结果以数组的形式返回
- {replace: 'collectionName'}：将结果添加到collectionName:结果替换集合
- {reduce: 'collectionName'}：将结果添加到collectionName:如果检测到dup，则使用reducer / finalize函数
- {merge: 'collectionName'}：对collectionName的结果:如果dups存在，新的文档将覆盖旧的

如果选项out设置为replace、merge或reduce，将返回一个模型实例，该模型实例可用于进一步的查询。针对这个模型运行的查询都是通过lean选项执行的;这意味着只返回js对象，不应用Mongoose魔法(getter、setter等)。

```js
const o = {};
// You can also define `map()` and `reduce()` as strings if your
// linter complains about `emit()` not being defined
o.map = 'function () { emit(this.name, 1) }';
o.reduce = 'function (k, vals) { return vals.length }';
o.out = { replace: 'createdCollectionNameForResults' }
o.verbose = true;

User.mapReduce(o, function (err, model, stats) {
  console.log('map reduce took %d ms', stats.processtime)
  model.find().where('value').gt(10).exec(function (err, docs) {
    console.log(docs);
  });
})

// `mapReduce()` returns a promise. However, ES6 promises can only
// resolve to exactly one value,
o.resolveToObject = true;
const promise = User.mapReduce(o);
promise.then(function (res) {
  const model = res.model;
  const stats = res.stats;
  console.log('map reduce took %d ms', stats.processtime)
  return model.find().where('value').gt(10).exec();
}).then(function (docs) {
   console.log(docs);
}).then(null, handleError).end()
```

### [Model.populate()](https://mongoosejs.com/docs/api/model.html#model_Model.populate)

填充文档引用。

可用的顶级选项:

- path:空格分隔的路径(s)填充
- select:可选字段选择
- match:可选查询条件匹配
- model:可选的模型名称用于人口
- options:可选查询选项，如排序，限制等
- justOne:可选布尔，如果真Mongoose将始终设置路径到一个数组。默认从架构推断。

```js
// populates a single object
User.findById(id, function (err, user) {
  const opts = [
    { path: 'company', match: { x: 1 }, select: 'name' },
    { path: 'notes', options: { limit: 10 }, model: 'override' }
  ];

  User.populate(user, opts, function (err, user) {
    console.log(user);
  });
});

// populates an array of objects
User.find(match, function (err, users) {
  const opts = [{ path: 'company', match: { x: 1 }, select: 'name' }];

  const promise = User.populate(users, opts);
  promise.then(console.log).end();
})

// imagine a Weapon model exists with two saved documents:
//   { _id: 389, name: 'whip' }
//   { _id: 8921, name: 'boomerang' }
// and this schema:
// new Schema({
//   name: String,
//   weapon: { type: ObjectId, ref: 'Weapon' }
// });

const user = { name: 'Indiana Jones', weapon: 389 };
Weapon.populate(user, { path: 'weapon', model: 'Weapon' }, function (err, user) {
  console.log(user.weapon.name); // whip
})

// populate many plain objects
const users = [{ name: 'Indiana Jones', weapon: 389 }]
users.push({ name: 'Batman', weapon: 8921 })
Weapon.populate(users, { path: 'weapon' }, function (err, users) {
  users.forEach(function (user) {
    console.log('%s uses a %s', users.name, user.weapon.name)
    // Indiana Jones uses a whip
    // Batman uses a boomerang
  });
});
// Note that we didn't need to specify the Weapon model because
// it is in the schema's ref
```

### [Model.prototype.$where](https://mongoosejs.com/docs/api/model.html#model_Model-$where)

### [Model.prototype.$where()](https://mongoosejs.com/docs/api/model.html#model_Model-$where)

创建查询并指定$where条件

有时候你需要使用JavaScript表达式在mongodb中查询一些东西。你可以通过find({$where: javascript})，或者你可以通过查询链或从你的mongoose模型使用mongoose快捷方法$where。

```js
Blog.$where('this.username.indexOf("val") !== -1').exec(function (err, docs) {});
```

### [Model.prototype.base](https://mongoosejs.com/docs/api/model.html#model_Model-base)

模型使用的基本Mongoose实例。

### [Model.prototype.baseModelName](https://mongoosejs.com/docs/api/model.html#model_Model-baseModelName)

如果这是一个鉴别器模型，baseModelName就是基础模型的名称。

### [Model.prototype.collection](https://mongoosejs.com/docs/api/model.html#model_Model-collection)

模型使用的集合。此属性是只读的。修改此属性是无操作的。

### [Model.prototype.db](https://mongoosejs.com/docs/api/model.html#model_Model-db)

模型使用的连接。

### [Model.prototype.delete](https://mongoosejs.com/docs/api/model.html#model_Model-delete)

别名删除

### [Model.prototype.deleteOne()](https://mongoosejs.com/docs/api/model.html#model_Model-deleteOne)

从数据库中删除该文档。相当于.remove()。

```js
product = await product.deleteOne();
await Product.findById(product._id); // null
```

### [Model.prototype.discriminators](https://mongoosejs.com/docs/api/model.html#model_Model-discriminators)

为这个模型注册鉴别器。

### [Model.prototype.model()](https://mongoosejs.com/docs/api/model.html#model_Model-model)

返回另一个模型实例。

```js
const doc = new Tank;
doc.model('User').findById(id, callback);
```

### [Model.prototype.modelName](https://mongoosejs.com/docs/api/model.html#model_Model-modelName)

模型的名称。

### [Model.prototype.remove()](https://mongoosejs.com/docs/api/model.html#model_Model-remove)

从数据库中删除该文档。

```js
product.remove(function (err, product) {
  if (err) return handleError(err);
  Product.findById(product._id, function (err, product) {
    console.log(product) // null
  })
})
```

作为流控制的一种额外措施，remove将返回一个Promise(如果传递则绑定到fn)，这样它就可以被链接或连接到接收错误

```js
product.remove().then(function (product) {
   ...
}).catch(function (err) {
   assert.ok(err)
})
```

### [Model.prototype.save()](https://mongoosejs.com/docs/api/model.html#model_Model-save)

通过将新文档插入数据库if文档来保存此文档。isNew为true，如果isNew为false，则发送一个updateOne操作，只包含修改后的路径。

```js
product.sold = Date.now();
product = await product.save();
```

如果保存成功，返回的承诺将与保存的文档一起实现。

```js
const newProduct = await product.save();
newProduct === product; // true
```

### [Model.prototype.schema](https://mongoosejs.com/docs/api/model.html#model_Model-schema)

模型使用的架构。

### [Model.remove()](https://mongoosejs.com/docs/api/model.html#model_Model.remove)

从集合中删除与条件匹配的所有文档。若要仅删除第一个匹配条件的文档，请将单个选项设置为true。

```js
const res = await Character.remove({ name: 'Eddard Stark' });
res.deletedCount; // Number of documents removed
```

注意 ：该方法直接向MongoDB发送一个remove命令，不涉及Mongoose文档。因为没有涉及到Mongoose文档，所以Mongoose不执行文档中间件。

### [Model.replaceOne()](https://mongoosejs.com/docs/api/model.html#model_Model.replaceOne)

与update()相同，除了MongoDB用给定的文档替换现有的文档(没有像$set这样的原子操作符)。

```js
const res = await Person.replaceOne({ _id: 24601 }, { name: 'Jean Valjean' });
res.n; // Number of documents matched
res.nModified; // Number of documents modified
```

此函数触发以下中间件。

- `replaceOne()`

### [Model.startSession()](https://mongoosejs.com/docs/api/model.html#model_Model.startSession)

要求MongoDB >= 3.6.0。启动MongoDB会话，以获得因果一致性、可重复写和事务等好处。

调用MyModel.startSession()相当于调用MyModel.db.startSession()。

此函数不会触发任何中间件。

```js
const session = await Person.startSession();
let doc = await Person.findOne({ name: 'Ned Stark' }, null, { session });
await doc.remove();
// `doc` will always be null, even if reading from a replica set
// secondary. Without causal consistency, it is possible to
// get a doc back from the below query if the query reads from a
// secondary that is experiencing replication lag.
doc = await Person.findOne({ name: 'Ned Stark' }, null, { session, readPreference: 'secondary' });
```

### [Model.syncIndexes()](https://mongoosejs.com/docs/api/model.html#model_Model.syncIndexes)

使MongoDB中的索引与这个模型的模式中定义的索引匹配。这个函数将删除除_id索引之外模型模式中没有定义的所有索引，并构建在您的模式中但不在MongoDB中的所有索引。

有关更多信息，请参阅介绍性[introductory blog post](http://thecodebarbarian.com/whats-new-in-mongoose-5-2-syncindexes)博客文章

```js
const schema = new Schema({ name: { type: String, unique: true } });
const Customer = mongoose.model('Customer', schema);
await Customer.collection.createIndex({ age: 1 }); // Index is not in schema
// Will drop the 'age' index and create an index on `name`
await Customer.syncIndexes();
```

### [Model.translateAliases()](https://mongoosejs.com/docs/api/model.html#model_Model.translateAliases)

转化任何别名字段/条件，使最终的查询或文档对象是纯的

```js
Character
  .find(Character.translateAliases({
    '名': 'Eddard Stark' // Alias for 'name'
  })
  .exec(function(err, characters) {})
```

注意：只转化对象类型的参数，其他的都是原始返回的

### [Model.update()](https://mongoosejs.com/docs/api/model.html#model_Model.update)

更新数据库中的一个文档而不返回它。

此函数触发以下中间件。

- `update()`

```js
MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);

const res = await MyModel.update({ name: 'Tobi' }, { ferret: true });
res.n; // Number of documents that matched `{ name: 'Tobi' }`
// Number of documents that were changed. If every doc matched already
// had `ferret` set to `true`, `nModified` will be 0.
res.nModified;
```

有效的选项：

- strict：重写此更新的模式级严格选项
- upsert：如果不匹配是否创建文档(false)
- writeConcern：设置副本集的写关注。覆盖架构级的写关注
- omitUndefined：如果为true，则删除在转换更新时未定义的所有属性。换句话说，如果设置了这个，Mongoose将从模型更新中删除baz。updateOne({}， {foo: 'bar'， baz: undefined})在发送更新到服务器之前。
- multi：是否需要更新多个文档(false)
- runValidators：如果为true，则在此命令上运行更新验证器。更新验证器根据模型的模式验证更新操作。
- setDefaultsOnInsert：如果这个和upsert为true，那么当创建一个新文档时，mongoose将应用模型模式中指定的默认值。这个选项只适用于MongoDB >= 2.4，因为它依赖于MongoDB的$setOnInsert操作符。
- timestamps：如果设置为false并且启用了模式级时间戳，则跳过此更新的时间戳。如果没有设置模式级时间戳，则不执行任何操作。
- overwrite：禁用仅更新模式，允许您覆盖文档(false)

在发送之前，所有更新值都被转换为它们适当的模式类型。

回调函数接收(err, rawResponse)。

- err是发生错误时的错误

- rawResponse是Mongo的完整回应

注意 ：所有非`atomic`操作名的顶级键都被视为集合操作:

```js
const query = { name: 'borne' };
Model.update(query, { name: 'jason bourne' }, options, callback);

// is sent as
Model.update(query, { $set: { name: 'jason bourne' }}, options, function(err, res));
// if overwrite option is false. If overwrite is true, sent without the $set wrapper.
```

这有助于防止意外地用{name: 'jason bourne'}覆盖集合中的所有文档

注意不要为update子句使用现有的模型实例(这将不起作用，并可能导致像无限循环这样的怪异行为)。另外，确保update子句没有_id属性，这将导致Mongo返回“Mod on _id not allowed”错误。

当使用更新时，Mongoose cast值并运行setter。默认情况下不应用以下特性。

- [defaults](https://mongoosejs.com/docs/defaults.html#the-setdefaultsoninsert-option)
- [validators](https://mongoosejs.com/docs/validation.html#update-validators)
- middleware

如果您需要文档中间件和全功能验证，请先加载文档，然后使用save()。

```js
Model.findOne({ name: 'borne' }, function (err, doc) {
  if (err) ..
  doc.name = 'jason bourne';
  doc.save(callback);
})
```

### [Model.updateMany()](https://mongoosejs.com/docs/api/model.html#model_Model.updateMany)

与update()相同，除了MongoDB将更新所有匹配过滤器的文档(而不是只更新第一个)，不管multi选项的值是多少。

注意:updateMany不会触发更新中间件。使用pre('updateMany')和post('updateMany')代替。

```js
const res = await Person.updateMany({ name: /Stark$/ }, { isDeleted: true });
res.n; // Number of documents matched
res.nModified; // Number of documents modified
```

此函数触发以下中间件：updateMany ()

### [Model.updateOne()](https://mongoosejs.com/docs/api/model.html#model_Model.updateOne)

与update()相同，除了它不支持multi或overwrite选项。

- MongoDB将只更新第一个匹配过滤器的文档，而不管multi选项的值。
- 如果您想覆盖整个文档而不是使用像$set这样的原子atomic操作符，请使用replaceOne()。

```js
const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
res.n; // Number of documents matched
res.nModified; // Number of documents modified
```

此函数触发以下中间件：updateOne ()

### [Model.validate()](https://mongoosejs.com/docs/api/model.html#model_Model.validate)

根据模型的模式强制转换和验证给定对象，将给定的上下文传递给定制验证器。

```js
const Model = mongoose.model('Test', Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true }
});

try {
  await Model.validate({ name: null }, ['name'])
} catch (err) {
  err instanceof mongoose.Error.ValidationError; // true
  Object.keys(err.errors); // ['name']
}
```

### [Model.watch()](https://mongoosejs.com/docs/api/model.html#model_Model.watch)

此函数不会触发任何中间件。特别是，它不会触发聚合中间件。

- 'change':发生了更改，请参见下面的示例

- 'error':发生了一个不可恢复的错误。特别是，如果当前更改流失去与复制集主的连接，则错误输出。关注GitHub的更新。
- 'end':在底层流关闭时触发
- 'close':如果底层流关闭则触发

```js
const doc = await Person.create({ name: 'Ned Stark' });
const changeStream = Person.watch().on('change', change => console.log(change));
// Will print from the above `console.log()`:
// { _id: { _data: ... },
//   operationType: 'delete',
//   ns: { db: 'mydb', coll: 'Person' },
//   documentKey: { _id: 5a51b125c5500f5aa094c7bd } }
await doc.remove();
```

### [Model.where()](https://mongoosejs.com/docs/api/model.html#model_Model.where)

创建查询，应用传递的条件，并返回查询。

例如，不写:

```js
User.find({age: {$gte: 21, $lte: 65}}, callback);
```

我们可以写成:

```js
User.where('age').gte(21).lte(65).exec(callback);
```

因为查询类也支持在哪里可以继续链接

```js
User
.where('age').gte(21).lte(65)
.where('name', /^b/i)
... etc
```

### [increment()](https://mongoosejs.com/docs/api/model.html#increment_increment)

表示我们希望增加这个文档版本。

```js
Model.findById(id, function (err, doc) {
  doc.increment();
  doc.save(function (err) { .. })
})
```