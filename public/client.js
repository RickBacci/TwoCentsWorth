var socket = io();

var submitPoll = document.getElementById('submit-poll');

submitPoll.addEventListener('click', function(event) {
  event.preventDefault();

  var question = document.getElementById('question').value;
  var choiceA  = document.getElementById('choice-A').value;
  var choiceB  = document.getElementById('choice-B').value;
  var choiceC  = document.getElementById('choice-C').value;
  var choiceD  = document.getElementById('choice-D').value;

  var poll = {
    question: question,
    choiceA: choiceA,
    choiceB: choiceB,
    choiceC: choiceC,
    choiceD: choiceD,
  }
  console.log(poll);
  socket.send('pollCreated', poll)
});


var adminUrl = document.getElementById('admin-url');
var voterUrl = document.getElementById('voter-url');
var baseUrl  = 'http://localhost:3000'

socket.on('urls', function(urls) {
  adminUrl.innerText = "Admin Url: " + baseUrl + urls.admin;
  voterUrl.innerText = "Voter Url: " + baseUrl + urls.voter;
});


