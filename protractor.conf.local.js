var fs = require('fs');

var { extendConfig, argv } = require('./protractor.conf.base');

var LOCAL_IP = fs.readFileSync('./LOCAL_IP', 'utf8').trim() || 'localhost';

var localConfig = {
    baseUrl: 'http://' + LOCAL_IP +':9001',

    maxSessions: 10,

    seleniumAddress: 'http://localhost:4444/wd/hub',

    params: {
        envType: 'local'
    }
};

module.exports = {
    // hijack callback and extendConfig to add own localConfig
    extendConfig: function(callback) {
        return extendConfig(
            function(baseConfig, createCapabilities) {
                var newBaseConfig = Object.assign({}, baseConfig, localConfig);
                return Object.assign({}, localConfig, callback(newBaseConfig, createCapabilities));
            },
            './test/reports/local/'
        );
    },
    argv
};
