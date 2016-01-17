# TwoCentsWorth


### Testing

Mocha
expect.js
[NightWatch](http://nightwatchjs.org/guide#installation)

To install the stand-alone Selenium server required to run NightWatch:

brew install selenium-server-standalone

To run selenium, do: selenium-server -port 4444

For more options: selenium-server -help

To run feature tests:

nightwatch --group features
or
npm test

To run unit tests:

mocha tests/unit/*
