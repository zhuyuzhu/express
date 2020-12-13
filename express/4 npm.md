# npm：node package manager  node包管理器

npm菜鸟教程：https://www.runoob.com/nodejs/nodejs-npm.html



**npm init**

初始化项目   `npm init -y / --yes `跳过项目说明文件的填写直接创建项目

**npm install**

根据package.json和package-lock.json来下载对应的依赖包到`node_modules`文件夹中 

#### 了解package.json

全局安装：安装到node全局中，可以在本地的任何位置使用的包

```shell
npm install 包名 --global
```

比如：

forever全局安装，在任何地方都可以使用`forever app.js`来启动app.js

```shell
npm install forever -g
```

`devDependencies`开发依赖：

以下命令下载的包，会在`devDependencies`中，表明这些包是开发所以依赖的包

```shell
npm install gulp-babel
```



`dependencies`生成依赖：

以下命令下载的包，会在`dependencies`中，表明这些包在生产环境中依赖。上线依赖，比如express

```shell
npm install express --save
```



注意：命令权限名可以在包名前，后者包名后

```shell
npm install 包名 --权限
npm insatll --权限 包名
```



```json
{
  "name": "technology-stack",
  "version": "1.0.0",
  "description": "All technology in this,
  "main": "jquery-3.4.1.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "babel": "gulp babel"
  },
  "repository": {
    "type": "git",
    "url": "https://gitee.com/zhuyuzhu/Technology-stack.git"
  },
  "author": "zhuyuzhu",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-preset-es2015": "^6.24.1",
    "gulp": "^4.0.2",
    "gulp-babel": "^7.0.1",
    "gulp-concat": "^2.6.1",
    "gulp-less": "^4.0.1",
    "gulp-uglify": "^3.0.2"
  },
  "dependencies": {
    "art-template": "^4.13.2",
    "express": "^4.17.1",
    "express-art-template": "^1.0.1"
  }
}

```

#### 了解package-lock.json

`package-lock.json`锁定每个包的版本，它的特点是，明确了各个包的具体版本。

与`package.json`的区别：

`package.json`只显示项目中依赖的包；而`package-lock.json`显示所有包，包括包的依赖包。所以`package-lock.json`中的包与`node_modules`中对应。



#### 了解node_modules

`node_modules`文件夹中，有所有的依赖包，且依赖包的源码在该文件夹中存储。



### npm run ‘script’标签内容（package.json中“script”)

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "babel": "gulp babel"
  },
```

以上配置可以让我们使用`npm run test`  和 `npm run babel` 命令，而执行`test` 和 `babel`对应的值，该值是**真正的执行命令**。

注意：`&&`可以拼接多个命令



#### nmp相关命令：

```shell
npm --version  查看npm版本
npm install npm --global  升级npm
npm i -S 包名：  简写，下载生成依赖

npm uninstall 包名： 卸载某个开发依赖包
npm uninstall --save 包名：卸载某个生产依赖包

npm --help 查看帮助
npm 命令（比如install）--help 查看命令（比如install）的帮助信息

```

### npm被墙的问题：

http://npm.taobao.org/  npm在国内做的备份，好像是每十分钟就更新一次。其实很多公司也有自己的仓库，我们公司就有自己的仓库。

```shell
npm install --global cnpm
```

就可以使用`cnpm` 来代替 `npm`

如果你不想下载淘宝镜像，而下载某个依赖包的时候，又想使用淘宝镜像，可以试下下面命令：

```shell
npm install 包名 --registry=https://registry.npm.taobao.org
```



##### 也可以直接配置，让`npm`命令从淘宝镜像的服务器获取资源，而非npm服务器中获取：

```shell
npm config set registry https://registry.npm.taobao.org
```

##### 那么如何查看npm的config配置信息呢？

```shell
npm config list
```

### 如何切换`npm`命令的仓库源呢？——nrm

**nrm ：**nrm(npm registry manager )是npm的镜像源管理工具，有时候国外资源太慢，使用这个就可以**快速地在 npm 源间切换**

**全局安装nrm**：

```shell
npm intall --global nrm
```

查看是否安装成功：

```shell
nrm --version
```

执行命令nrm ls查看可选的源：**带*的是当前使用的源**

```shell
$ nrm ls

* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/

```

**切换`npm`命令的仓库源**：

**其中reigstry为源名，url为源的路径。**

```shell
nrm use <registry>
比如：nrm use taobao
```

切换源之后，`npm`命名install下载依赖包时，就会去修改后的源服务器中获取资源。

**添加仓库源：**

可以增加定制的源，特别适用于添加企业内部的私有源，执行命令 

```shell
nrm add <registry> <url>
比如：nrm add kd  http://17.87.10.150/
```

**删除仓库源：**

```shell
nrm del <registry>
```

