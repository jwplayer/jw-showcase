var { config, createCapabilities } = require('./protractor.conf.local');

config.multiCapabilities = [
    // iPhone with iOS 7
    createCapabilities({
        browserName: 'safari',
        platformName: 'iOS',
        platformVersion: '10.3',
        automationName: 'XCUITest',
        deviceName: 'iPhone 5s'
    }, ['@mobile'])
];

config.seleniumAddress = 'http://localhost:4723/wd/hub';
config.baseUrl = 'http://localhost:9001';

module.exports = {
    config
};
