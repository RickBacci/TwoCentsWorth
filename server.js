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

  // response.render('poll', { poll: poll });
  response.redirect(show);
});

app.get('/polls/:id', function(request, response) {
  var id   = request.params.id;
  var poll;

  poll = _.forEach(polls, function(val, i) {
    if (id === val.adminString) {
      val.urlType = 'admin';
      console.log(val)
      return val;
    } else if( id === val.voterString) {
      val.urlType = 'voter';
      console.log(val)
      return val;
    } else {
      console.log('URL not found.')
    }
    return val;
  });

  response.render('poll', { poll: poll });
});


var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


module.exports = server;
