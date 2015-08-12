var http = require("http"),
    ASQ = require("asynquence"),
    node_static = require("node-static"),
    io = require("socket.io");

var host = "localhost";
var port = 8006;

var static_files = new node_static.Server(__dirname);

function handleHTTP(req, res) {
  if (req.method === "GET") {
    if (/^\/\d+(?=$|[\/?#])/.test(req.url)) {
      req.addListener("end",function(){
        req.url = req.url.replace(/^\/(\d+).*$/,"/$1.html");
        static_files.serve(req,res);
      });
      req.resume();
    } 
    else {
      res.writeHead(403);
      res.end("Get outta here!");
    }    
  } 
  else {
    res.writeHead(403);
    res.end("Get outta here!");
  }
}

var http_serv = http.createServer(handleHTTP)
                    .listen(port, host);

io.listen(http_serv);
