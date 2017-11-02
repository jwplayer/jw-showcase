const { extendConfig } = require('./protractor.conf.local');

module.exports = {
    config: extendConfig(
        function(baseConfig, createCapabilities) {
            return {
                multiCapabilities: [
                    // iPhone with iOS 7
                    createCapabilities({
                        browserName: 'safari',
                        platformName: 'iOS',
                        platformVersion: '10.3',
                        automationName: 'XCUITest',
                        deviceName: 'iPhone 5s'
                    }, ['@mobile'])
                ],

                seleniumAddress: 'http://localhost:4723/wd/hub',
                baseUrl: 'http://localhost:9001'
            };
        }
    )
};
