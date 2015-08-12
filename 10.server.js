var http = require("http"),
    ASQ = require("asynquence"),
    node_static = require("node-static");

var host = "localhost";
var port = 8006;
var http_serv = http.createServer(handleHTTP)
                    .listen(port, host);

var static_files = new node_static.Server(__dirname);

var io = require("socket.io").listen(http_serv);

function handleHTTP(req, res) {
  if (req.method === "GET") {
    if (/^\/\d+(?=$|[\/?#])/.test(req.url)) {
      req.addListener("end",function(){
        req.url = req.url.replace(/^\/(\d+).*$/,"/$1.html");
        static_files.serve(req,res);
      });
      req.resume();
    } 
    else if (req.url === "/jquery.js") {
      static_files.serve(req, res);
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

function handleIO(socket) {
  console.log("client connected");

  socket.on("disconnect", function() {
    clearInterval(intv);
    console.log("client disconnected");
  });

  socket.on("msg", function(msg) {
    socket.broadcast.emit("broadcast",msg);
  });

  socket.on("spy", function(x,y) {
    socket.broadcast.emit("spy", {
      x: x, 
      y: y
    });
  });

  var intv = setInterval(function() {
    socket.emit("hello", Math.random());
  }, 1000);
}

io.configure(function() {
  io.enable("browser client minification");
  io.enable("browser client etag");
  io.set("log level", 1);
  io.set("transports", [
    "websocket",
    "xhr-polling",
    "jsonp-polling"
  ]);
});

io.on("connection", handleIO); 
