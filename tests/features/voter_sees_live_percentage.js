module.exports = {
  'Voter can see percentages' : function (client) {

    visitRoot(client);
    checkTitle(client);
    makeChoices(client);
    submitForm(client);

    client.expect.element('#main').to.contain.text('Admin Show Page');
    client.expect.element('#main').to.not.contain.text('Voter Show Page');

    client.click('.voter-url').pause(1000);

    client.expect.element('#main').to.not.contain.text('Admin Show Page');
    client.expect.element('#main').to.contain.text('Voter Show Page');

    client.expect.element('.admin-url').text.to.contain('localhost');
    client.expect.element('.voter-url').text.to.contain('localhost');

    client.expect.element('#question').text.to.contain('Why?');

    client.expect.element('.button-choice-0').text.to.contain('choiceA');
    client.expect.element('.button-choice-1').text.to.contain('choiceB');
    client.expect.element('.button-choice-2').text.to.contain('choiceC');
    client.expect.element('.button-choice-3').text.to.contain('choiceD');

    client.expect.element('.poll-percentage-0').text.to.contain('0');
    client.expect.element('.poll-percentage-1').text.to.contain('0');
    client.expect.element('.poll-percentage-2').text.to.contain('0');
    client.expect.element('.poll-percentage-3').text.to.contain('0');

    client.click('.button-choice-0')
    client.expect.element('.poll-percentage-0').text.to.contain('100');

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
