var socket          = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage   = document.getElementById('status-message');
var buttons         = document.querySelectorAll('.choices');
var pollId          = document.getElementById('poll');


socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

