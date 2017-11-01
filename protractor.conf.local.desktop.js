var { config, createCapabilities, argv } = require('./protractor.conf.local');

config.multiCapabilities = [];

var supportedBrowsers = ['chrome', 'firefox', 'safari', 'opera', 'iphone'];
var browsers = supportedBrowsers;
if (argv.browser) {
    browsers = typeof argv.browser === 'string' ? [argv.browser] : argv.browser;
}

browsers.forEach(function(browser) {
    if (supportedBrowsers.indexOf(browser) === -1) {
        return;
    }

    switch(browser) {
    case 'iphone':
        config.multiCapabilities.push(
            // chrome iPhone emulation
            createCapabilities({
                browserName: 'chrome',
                device: 'iPhone 6',
                chromeOptions: {
                    mobileEmulation: {
                        deviceName: 'iPhone 6'
                    }
                }
            }, ['@mobile'])
        );
        break;
    default:
        config.multiCapabilities.push(
            createCapabilities({
                browserName: browser
            }, ['@desktop'])
        );
        break;
    }
});

config.onPrepare = function() {
    /* global browser */
    return browser.getProcessedConfig().then(function(config) {
        var viewport = config.capabilities.viewport || 'default';

        /* eslint-disable no-console */
        console.log('Viewport:', viewport);

        switch (viewport) {
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

        return config;
    });
};

module.exports = {
    config
};
