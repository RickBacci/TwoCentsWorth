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

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    var ballot            = { 'vote': {}, 'url': pollId.dataset.id };
    var socketId          = socket.id.toString();
    ballot.vote[socketId] = this.dataset.val;
    console.log(this.dataset.val);
    socket.send('voteCast', ballot);
  });
}
