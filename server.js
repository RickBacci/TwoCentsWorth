const http       = require('http');
var express      = require('express');
var app          = express();
var randomString = require('./random-string');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var Poll         = require('./poll');

var polls        = [];


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'jade');

app.get('/', function(request, response) {
  response.render('index')
});

app.post('/polls', function(request, response) {
  var id   = randomString()
  var poll = new Poll(id, request);
  var show = '/polls/' + poll.id;

  polls.push(poll);

  response.redirect(show);
});

app.get('/polls/:id', function(request, response) {
  var id   = request.params.id;

  var adminPoll = _.find(polls, function(poll) { return poll.adminString === id; });
  var voterPoll = _.find(polls, function(poll) { return poll.voterString === id; });

  if (adminPoll) {
    response.render('poll', { poll: adminPoll });
  } else {
    response.render('poll', { poll: voterPoll });
  }
});


var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


module.exports = server;
