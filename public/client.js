var socket          = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage   = document.getElementById('status-message');
var buttons         = document.querySelectorAll('.choices');
var pollId          = document.getElementById('poll');
var pollStatus      = document.getElementById('toggle-poll-status');

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


pollStatus.addEventListener('click', function() {
    var message = {
      'url':    pollId.dataset.id,
      'status': pollStatus.innerText
    };
    console.log(message)
    socket.send('togglePollStatus', message);
})

var total0 = document.getElementById('percentage-0');
var total1 = document.getElementById('percentage-1');
var total2 = document.getElementById('percentage-2');
var total3 = document.getElementById('percentage-3');

socket.on('voteCount', function(votes) {
  var totalVotes = votes['0'] + votes['1'] + votes['2'] + votes['3'];

  $('#percentage-0').text(calculatePercent(votes['0'], totalVotes));
  $('#percentage-1').text(calculatePercent(votes['1'], totalVotes));
  $('#percentage-2').text(calculatePercent(votes['2'], totalVotes));
  $('#percentage-3').text(calculatePercent(votes['3'], totalVotes));

  function calculatePercent(votes, totalVotes){
    if (!isFinite(votes / totalVotes) * 100){
      return 0;
    } else {
      num = (votes / totalVotes) * 100;
      return num.toFixed(0);
    }
  }
});


socket.on('togglePollStatus', function(status) {
  $('#toggle-poll-status').text(status)
  console.log('socket id in client: ' + socket.id);
});



