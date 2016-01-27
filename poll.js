module.exports = function Poll(id, request) {
  this.id          = id.substr(0, 20);
  this.pollType    = request.body.polltype || 'Public'
  this.status      = 'open';
  this.question    = request.body.question || "Is this a question?";
  this.choices     = request.body.poll.choices || ['none', 'none1', 'none2'];
  this.endTime     = request.body.endtime || "none";

  this.adminString = this.id;
  this.voterString = id.substr(20, 20);

  this.hostname    = request.protocol + '://' + request.get('host');
  this.adminUrl    = this.hostname + '/polls/' + this.id;
  this.voterUrl    = this.hostname + '/polls/' + this.voterString;
  this.votes       = {};
  this.voteCount   = { '0':0, '1':0, '2':0, '3':0 };
};



