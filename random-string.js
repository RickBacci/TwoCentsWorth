var crypto     = require('crypto');

module.exports = function randomString(string) {
  return string || crypto.randomBytes(10).toString('hex');
}
