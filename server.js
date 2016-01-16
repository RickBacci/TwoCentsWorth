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

redis.on("error", function (err) { console.log("Error " + err); });
redis.on('connect', function() { console.log('connected'); });

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.render('index')
});

app.post('/polls', function(request, response) {
  var pollType    = request.body.polltype;
  var status      = 'open';
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

  redis.hgetall("polls", function (err, poll) {

    var host = request.protocol + '://' + request.get('host') + "/polls/"

    poll.adminUrl = host + poll.adminString
    poll.voterUrl = host + poll.voterString

    response.render('poll', { poll: poll })
  });

});

var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


function randomString() {
  return crypto.randomBytes(10).toString('hex');
}


module.exports = server;
