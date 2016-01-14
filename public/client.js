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
});




