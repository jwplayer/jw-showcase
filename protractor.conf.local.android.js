var { config, createCapabilities } = require('./protractor.conf.local');

config.multiCapabilities = [
    // Android 7
    createCapabilities({
        browserName: 'chrome',
        platformName: 'Android',
        platformVersion: '8.0.0',
        deviceName: 'Android Emulator',
    }, ['@mobile'])
];

config.seleniumAddress = 'http://localhost:4723/wd/hub';
config.baseUrl = 'http://10.0.2.2:9001';

module.exports = {
    config
};
