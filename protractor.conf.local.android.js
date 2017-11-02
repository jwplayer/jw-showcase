const { extendConfig } = require('./protractor.conf.local');

module.exports = {
    config: extendConfig(
        function(baseConfig, createCapabilities) {
            return {
                multiCapabilities: [
                    // Android 7
                    createCapabilities({
                        browserName: 'chrome',
                        platformName: 'Android',
                        platformVersion: '8.0.0',
                        deviceName: 'Android Emulator',
                    }, ['@mobile'])
                ],

                seleniumAddress: 'http://localhost:4723/wd/hub',
                baseUrl: 'http://10.0.2.2:9001'
            };
        }
    )
};
