const http     = require('http');
var express    = require('express');
var app        = express();
var crypto     = require('crypto');
var bodyParser = require('body-parser')

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}

redis.on("error", function (err) {
  console.log("Error " + err);
});

redis.on('connect', function() {
  console.log('connected');
});


var polls   = {};

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});


app.post('/polls', function(request, response) {
  var pollType    = request.body.polltype;
  var status      = request.body.status || 'open';
  var adminString = randomString();
  var voterString = randomString();
  var question    = request.body.question;
  var choices     = request.body.poll;
  var endTime     = request.body.endtime;

  var poll = {
    'pollType': pollType,
    'status': status,
    'adminString': adminString,
    'voterString': voterString,
    'question': question,
    'choices': choices,
    'endTime': endTime
  };

  redis.hmset('polls', poll)

  redis.hkeys('polls', function (err, keys) {
    keys.forEach(function (key) {
      redis.hget(
        'polls', key,
        function(err, value) {
          console.log(key + ': ' + value);
        });
    });
    // redis.quit(); // TODO: find out if i need quit after every action
  });

  response.redirect('/polls/' + adminString);
});

app.get('/polls/:id', function(request, response) {
  var id = request.params.id;

  redis.hgetall("polls", function (err, obj) {
    console.log('This is the status: ' + obj.status)
  });
  response.sendFile(__dirname + '/public/poll.html');

});

var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


function randomString() {
  return crypto.randomBytes(10).toString('hex');
}


module.exports = server;
