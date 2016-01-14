const http  = require('http');
var express = require('express');
var app     = express();

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var port   = process.env.PORT || 3000;

var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const socketIo = require('socket.io');
const io       = socketIo(server);



module.exports = server;
