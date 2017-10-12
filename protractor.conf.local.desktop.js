var { config, createCapabilities } = require('./protractor.conf.local');

config.multiCapabilities = [
    // desktop screensize independent
    createCapabilities({
        browserName: 'chrome'
    }, ['@desktop']),

    createCapabilities({
        browserName: 'safari'
    }, ['@desktop']),

    createCapabilities({
        browserName: 'firefox',
        marionette: true
    }, ['@desktop']),

    createCapabilities({
        browserName: 'opera'
    }, ['@desktop']),

    // // desktop different screen sizes
    // createCapabilities({
    //     browserName: 'chrome'
    // }, ['@desktop-screen-desktop'], 'desktop'),
    //
    // createCapabilities({
    //     browserName: 'chrome'
    // }, ['@desktop-screen-tablet'], 'tablet'),
    //
    // createCapabilities({
    //     browserName: 'chrome'
    // }, ['@desktop-screen-mobile'], 'mobile'),
    //
    // // chrome iPhone emulation
    // createCapabilities({
    //     browserName: 'chrome',
    //     chromeOptions: {
    //         mobileEmulation: {
    //             deviceName: 'iPhone 6'
    //         }
    //     }
    // }, ['@mobile'])
];

config.onPrepare = function() {
    /* global browser */
    return browser.getProcessedConfig().then(function(config) {
        var screenSize = config.capabilities.screenSize || 'desktop';

        /* eslint-disable no-console */
        console.log('Screen size', screenSize);

        switch (screenSize) {
        case 'mobile':
            browser.driver.manage().window().setSize(480, 600);
            break;
        case 'tablet':
            browser.driver.manage().window().setSize(992, 600);
            break;
        default:
            browser.driver.manage().window().maximize();
            break;
        }
    });
};

module.exports = {
    config
};
