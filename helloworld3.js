var fs = require("fs"),
    ASQ = require("asynquence");
require("asynquence-contrib");

function readFile(filename) {
  return ASQ(function(done) {
    var stream = fs.createReadStream(filename);
    var contents = "";

    stream.pipe( fs.createWriteStream(filename+".backup") );

    stream.on("data", function(chunk) {
      contents += chunk;
    });
    stream.on("end", function() {
      done(contents);
    });
  });
}

function delayMsg(done, contents) {
  setTimeout(function() {
    done(contents);
  }, 1000);
}

function say(filename) {
  return readFile(filename)
    .then(delayMsg); 
}

module.exports.say = say;
