const http       = require('http');
var express      = require('express');
var app          = express();
var randomString = require('./random-string');
var bodyParser   = require('body-parser');
var redis        = configureRedis();


redis.on("error", function (err) { console.log("Error " + err); });
redis.on('connect', function() { console.log('Redis server connected'); });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.render('index')
});

app.post('/polls', function(request, response) {
  var adminString = randomString();
  var voterString = randomString();

  var poll = {
    'pollType': request.body.polltype,
    'status': 'open',
    'adminString': adminString,
    'voterString': voterString,
    'question': request.body.question,
    'choices': request.body.poll.choices,
    'endTime': request.body.endtime
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

  // TODO use id to actually find what i'm looking for :)

  redis.hgetall("polls", function (err, poll) {

    var host = request.protocol + '://' + request.get('host') + "/polls/"

    formatData(poll, host);

    response.render('poll', { poll: poll })

  });

});

function formatData(poll, host) {
  poll.adminUrl = host + poll.adminString
  poll.voterUrl = host + poll.voterString
  poll.choices = poll.choices.split(',')

  return poll;
}


var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


module.exports = server;



function configureRedis() {
  if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
    return redis;
  } else {
    var redis = require("redis").createClient();
    return redis;
  }
}
