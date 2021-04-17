var http = require("http");
var fs = require("fs");
var template = require("art-template");

http.createServer()
.on("request", function(req, res){
    if(req.url == "/favicon.ico"){
        
        return res.end();;
    }
    if(req.url == "/"){
        fs.readFile('./node.html', function(err, data){
            res.setHeader('Content-type','text/html; charset=utf-8');
            
            var htmlContent = template.render(String(data), {
                name: "zhuyuzhu",
                arr: [1,2,3]
            })
            res.end(htmlContent);
        })
    }
    else {
        res.writeHead(404,{'Content-Type': 'text/html;charset=UTF-8' })
        return res.end("404")
    }

})
.listen(8080, function(){
    console.log("server run...");
});
