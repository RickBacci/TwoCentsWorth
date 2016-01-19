const http       = require('http');
var express      = require('express');
var app          = express();
var randomString = require('./random-string');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var Poll         = require('./poll');
const socketIo   = require('socket.io');

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

  var adminPoll  = _.find(polls, function(poll) {
    poll.urlType = 'admin';
    return poll.adminString === id;
  });

  var voterPoll  = _.find(polls, function(poll) {
    poll.urlType = 'voter';
    return poll.voterString === id;
  });

  if (adminPoll) {
    response.render('poll', { urlType: 'admin', poll: adminPoll });
  } else {
    response.render('poll', { urlType: 'voter', poll: voterPoll });
  }
});


var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const io   = socketIo(server);

io.on('connection', function (socket) {
  var totalClients = io.engine.clientsCount;
  var welcomeMsg   = 'Give us your TwoCentsWorth!'

  console.log('A user has connected.', totalClients);
  io.sockets.emit('usersConnected', totalClients);
  socket.emit('statusMessage', welcomeMsg);

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      var currentPoll = _.find(polls, function(poll) {
        poll.id       = message.url;
        return poll;
      });

      console.log(message.vote)
      currentPoll.votes[message.vote] = message.vote;

      var total = countVotes(currentPoll.votes[message.vote])
      console.log(total)

      socket.emit('voteCount', countVotes(currentPoll.votes[message.vote]));
      io.sockets.emit('voteCount', countVotes(currentPoll.votes[message.vote]));
    }

  });

  function countVotes(votes) {
    var voteCount = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0
    };

    for (vote in votes) {
      voteCount[votes[vote]]++
    }
    return voteCount;
  }

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', totalClients);
    io.sockets.emit('usersConnected', totalClients);
  });
});

module.exports = server;
