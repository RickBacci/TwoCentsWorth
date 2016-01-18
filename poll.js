module.exports = function Poll(id, request) {
  this.id          = id.substr(0, 16);
  this.pollType    = request.body.polltype // || 'Anonymous'
  this.status      = 'open';
  this.question    = request.body.question || "no question";
  this.choices     = request.body.poll.choices || ['none', 'none1'];
  this.endTime     = request.body.endtime || "no endtime";

  this.adminString = this.id;
  this.voterString = id.substr(17, 16);

  this.hostname    = request.protocol + '://' + request.get('host');
  this.adminUrl    = this.hostname + '/polls/' + this.id;
  this.voterUrl    = this.hostname + '/polls/' + this.voterString;
};


