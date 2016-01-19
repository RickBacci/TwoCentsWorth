module.exports = {
  'Voter can see live updates' : function (client) {

    visitRoot(client);
    checkTitle(client);
    makeChoices(client);
    submitForm(client);

    client.expect.element('#poll').to.contain.text('Admin Show Page');
    client.expect.element('#poll').to.not.contain.text('Voter Show Page');

    client.click('.voter-url').pause(1000);

    client.expect.element('#poll').to.not.contain.text('Admin Show Page');
    client.expect.element('#poll').to.contain.text('Voter Show Page');

    client.expect.element('.admin-url').text.to.contain('localhost');
    client.expect.element('.voter-url').text.to.contain('localhost');

    client.expect.element('#question').text.to.contain('Why?');

    checkCorrectChoicesEntered(client);

    client.click('.choice-0');

    client.expect.element('#percentage-0').text.to.contain('100');

    client.click('.choice-1');

    client.expect.element('#percentage-0').text.to.contain('50');
    client.expect.element('#percentage-1').text.to.contain('50');

    client.end();
  }
};

// ----- private -----

function visitRoot(client) {
  client.url('http://localhost:3000').pause(1000);
}

function checkTitle(client) {
  client.expect.element('body').to.be.present.before(1000);
  client.assert.title('TwoCentsWorth');
}

function makeChoices(client) {
  client.setValue('input[name=question]', 'Why?')
  client.setValue('input#choice-A', 'choiceA')
  client.setValue('input#choice-B', 'choiceB')
  client.setValue('input#choice-C', 'choiceC')
  client.setValue('input#choice-D', 'choiceD')
}

function submitForm(client) {
  client.submitForm('form.form');
  client.pause(1000)
}

function checkCorrectChoicesEntered(client) {
  client.expect.element('.choice-0').text.to.contain('choiceA');
  client.expect.element('.choice-1').text.to.contain('choiceB');
  client.expect.element('.choice-2').text.to.contain('choiceC');
  client.expect.element('.choice-3').text.to.contain('choiceD');
}

function percentagesStartAt0(client) {
  client.expect.element('.percentage-0').text.to.contain('0');
  client.expect.element('.percentage-1').text.to.contain('0');
  client.expect.element('.percentage-2').text.to.contain('0');
  client.expect.element('.percentage-3').text.to.contain('0');
}
