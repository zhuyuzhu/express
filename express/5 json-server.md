# json-server

GitHub官网：https://github.com/typicode/json-server

安装：

```shell
npm install -g json-server
```

使用：

创建一个`db.josn`文件

```shell
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
```

开启服务：

```
json-server --watch db.json
```

可以按id来获取数据，比如：

Now if you go to http://localhost:3000/posts/1, you'll get

```
{ "id": 1, "title": "json-server", "author": "typicode" }
```

Also when doing requests, it's good to know that:

数据类型不支持string，最好还是数组、对象，布尔值。

