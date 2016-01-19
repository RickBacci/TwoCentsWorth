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
    var message = {
      'vote': this.dataset.val,
      'url': pollId.dataset.id
    }
    socket.send('voteCast', message);
  });
}

var total0 = document.getElementById('percentage-0') || 0;
var total1 = document.getElementById('percentage-1') || 0;
var total2 = document.getElementById('percentage-2') || 0;
var total3 = document.getElementById('percentage-3') || 0;

socket.on('voteCount', function(votes) {
  total0.innerText = (100 / votes['0']);
  total1.innerText = (100 / votes['1']);
  total2.innerText = (100 / votes['2']);
  total3.innerText = (100 / votes['3']);
});




