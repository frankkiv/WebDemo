var https   = require("https");     // https server core module
var fs      = require("fs");        // file system core module
var express = require("express");   // web framework external module
var io      = require("socket.io"); // web socket external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/public/"));

// Start Express https server on port 8443
var webServer = https.createServer(
{
    key:  fs.readFileSync(__dirname + "/pathtokeys/server.key"),
    cert: fs.readFileSync(__dirname + "/pathtokeys/server.crt")
},
httpApp).listen(8443);

var serv_io = io.listen(webServer);
serv_io.set('log level', 1); //turn off debug log

//import opencv lib
var tools = require('./lib/detect.js');

serv_io.sockets.on('connection', function(socket) {
  setInterval(function() {
    socket.emit('date', {'date': new Date()});
  }, 1000);

  socket.on('client_data', function(data, callback) {
	process.stdout.write(data.letter);
	callback(data.letter);
  });
  socket.on('client_image', function(data, callback){
 	tools.facedetect(data, function(faces){
		console.log("1"+faces);
		callback(faces);});
  });
});
