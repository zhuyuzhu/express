### session

cookie、session、token深入了解

什么是session？

http的特点：两点：无状态、



cookie保存一些非敏感信息，比如用户名，



session将重要信息保存在服务端，客户端只有一个凭证

比喻：session在服务器中存储的数据，而cookie是凭证；登录成功后，服务器会给前端设置一个凭证，每次请求时会带上该凭证cookie值；这样就可以到服务器中找到对应的session存储的数据了。

cookie过期，凭证就过期了，就无法访问服务器中的数据，session就过期了。重新登录，重新生成session和cookie。默认session在内存中存储，重启服务器session都会无效，所以可以做持久化存储session。



#### node和express都没有session功能，需要第三方插件：express-session

在node中的使用：

1、一定要在路由之前

2、添加session数据、访问session数据

比如：

```js
req.session.foo = 'bar'; //在session中添加数据
req.session.foo   //访问session数据
```

3、配置session

在npm官网中查看如何配置使用：https://www.npmjs.com/package/express-session

```js
req.session是个对象，可以在这个session对象添加各种值
```

```js
app.use(session({
  secret: 'keyboard cat', //配置加密字符串，加密时会拼接该字符串
  resave: false,
  saveUninitialized: true  //未初始化保存，默认会给客户端分配cookie配置，用户未登录的时，就会给客户端发送一个cookie凭证。如果是false，当用户登录时
   //后端代码调用设置session时，才会给客户端分配cookie值。
}))
```



4、登录成功后

可以把用户信息user存储到session中，每个用户请求的时候，根据cookie找到对应的session值，进行操作，处理。



5、md5二次加密时添加一个字符串

```js
md5(md5(body.password)+'zhu')
```



6、生成中，将session持久化存储，防止服务器崩溃后，数据丢失。那么node中该如何持久化存储session呢？

比如插件可以自动将session数据存入mongodb中。

7、清除登录状态

```js
req.session.user = null;
```



s%3Ak6j7aK9oAoIXnyBLCTWQI0tV3P9hIwgp.Ha77rncQnuBiG8gpiiDLn6%2Fk5Uzjt7a4Ckm7ivT32Ao

