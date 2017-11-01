
var { extendConfig, argv } = require('./protractor.conf.local');

// all browsers
var supportedBrowsers = ['chrome', 'firefox', 'safari', 'opera', 'iphone', 'edge', 'ie'];

// get browsers from argv
var browsers = supportedBrowsers;
if (argv.browser) {
    browsers = typeof argv.browser === 'string' ? [argv.browser] : argv.browser;
}

var config = extendConfig(
    function(baseConfig, createCapabilities) {
        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }

        var multiCapabilities = browsers.map(function(browser) {
            if (supportedBrowsers.indexOf(browser) === -1) {
                return;
            }

            switch(browser) {
            case 'iphone':
                // chrome iPhone emulation
                return createCapabilities({
                    browserName: 'chrome',
                    device: 'iPhone 6',
                    platform: 'MAC',
                    chromeOptions: {
                        mobileEmulation: {
                            deviceName: 'iPhone 6'
                        }
                    }
                }, ['@mobile']);
            case 'safari':
            case 'opera':
                return createCapabilities({
                    browserName: browser,
                    platform: 'MAC'
                });
            case 'ie':
                return createCapabilities({
                    browserName: 'internet explorer',
                    platform: 'WIN10'
                }, ['@desktop']);
            case 'edge':
                return createCapabilities({
                    browserName: 'MicrosoftEdge',
                    platform: 'WIN10'
                }, ['@desktop']);
            case 'chrome':
            case 'firefox':
                return [
                    createCapabilities({
                        browserName: browser,
                    }, ['@desktop']),

                    createCapabilities({
                        browserName: browser,
                        platform: 'WIN10'
                    }, ['@desktop'])
                ];
            default:
                return createCapabilities({
                    browserName: browser
                }, ['@desktop']);
            }
        }).filter(function(item) {
            return typeof item !== 'undefined';
        });

        return {
            multiCapabilities: flatten(multiCapabilities),

            onPrepare: function() {
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
            }
        };
    }
);

module.exports = {
    config
};
