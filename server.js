const http       = require('http');
var express      = require('express');
var app          = express();
var randomString = require('./random-string');
var bodyParser   = require('body-parser');
var redis        = configureRedis();
var Poll         = require('./poll');


redis.on('connect', function() { console.log('Redis server connected'); });
redis.on("error", function (err) { console.log("Error " + err); });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'jade');

app.get('/', function(request, response) {
  response.render('index')
});


app.post('/polls', function(request, response) {

  var adminString = randomString();
  var voterString = randomString();
  var id          = adminString + voterString;
  var poll        = new Poll(id, adminString, voterString, request);

  storePoll(id, poll, redis);

  response.render('poll', { poll: poll });
});

app.get('/polls/:id', function(request, response) {

  var id = request.params.id;
  var adminString = id.substr(0, 16);
  var voterString = id.substr(17, 16);

  // iterate over all of the polls in Redis and look for a match in the
  // adminString or voterString if one is found then send back
  // the id(both strings) and
  // what that person is (admin or voter)

  // then i will use the id to get the poll object

  var poll;

  redis.hgetall("polls", function (err, poll) {

    formatData(poll, buildHostString(request));

    response.render('poll', { poll: poll })

  });

});

function buildHostString(request) {
  return request.protocol + '://' + request.get('host') + "/polls/"
}


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

function logRedisKeys(redis) {
  redis.hkeys('polls', function (err, keys) {
    keys.forEach(function (key) {
      redis.hget(
        'polls', key,
        function(err, value) {
          console.log(key + ': ' + value);
        });
    });
  });
}

function storePoll(poll_id, poll, redis) {
  redis.hmset(poll_id, poll)
}


// TODO move Poll to it's own file

function Poll(id, adminString, voterString, request) {
  this.id          = id;
  this.pollType    = request.body.polltype;
  this.status      = 'open';
  this.question    = request.body.question;
  this.choices     = request.body.poll.choices;
  this.endTime     = request.body.endtime;

  this.adminString = adminString;
  this.voterString = voterString;

  this.adminUrl    = '/polls/' + adminString;
  this.voterUrl    = '/polls/' + voterString;
}



module.exports = server;
