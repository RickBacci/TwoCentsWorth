const http       = require('http');
var express      = require('express');
var app          = express();
var randomString = require('./random-string');
var bodyParser   = require('body-parser');
var Poll         = require('./poll');

var polls        = [];


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

    response.render('poll', { poll: poll })

  });

});


var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});


module.exports = server;
