const http  = require('http');
var express = require('express');
var app     = express();

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var port   = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
})



module.exports = app;
