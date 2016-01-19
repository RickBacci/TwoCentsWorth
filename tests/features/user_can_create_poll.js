module.exports = {
  'User can create a poll' : function (client) {
    client
    .url('http://localhost:3000')
    .pause(1000);

    client.expect.element('body').to.be.present.before(1000);
    client.assert.title('TwoCentsWorth');

    client.setValue('input[name=question]', 'Why?')
    client.setValue('input#choice-A', 'choiceA')
    client.setValue('input#choice-B', 'choiceB')
    client.setValue('input#choice-C', 'choiceC')
    client.setValue('input#choice-D', 'choiceD')
    client.submitForm('form.form');
    client.pause(1000)
    client.expect.element('.admin-url').text.to.contain('localhost');
    client.expect.element('.voter-url').text.to.contain('localhost');
    client.expect.element('#question').text.to.contain('Why?');
    client.expect.element('.choice-0').text.to.contain('choiceA');
    client.expect.element('.choice-1').text.to.contain('choiceB');
    client.expect.element('.choice-2').text.to.contain('choiceC');
    client.expect.element('.choice-3').text.to.contain('choiceD');
    client.end();
  }
};


