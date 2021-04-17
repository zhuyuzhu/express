var fs = require("fs");
var http = require("http");
var server = http.createServer();
server.listen("80",function(){
    console.log("listen 80 port");
})
//处理函数的两个参数内有一些属性和方法
server.on("request",function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
　　
　　fs.readFile('./node.html','utf-8',function(err,data){
　　　　if(err) console.log(err)
　　　　res.write(data)
　　　　res.end()
　　});
})