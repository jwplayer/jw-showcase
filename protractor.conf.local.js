var fs = require('fs');

var extendConfig = require('./protractor/_base');

var localIp;
try {
    localIp = fs.readFileSync('./LOCAL_IP', 'utf8').trim();
} catch(ex) {
    // ignore
}

var LOCAL_IP = localIp || 'localhost';

exports.config = extendConfig(
    function() {
        return {
            baseUrl: 'http://' + LOCAL_IP +':9001',

            maxSessions: 10,

            seleniumAddress: 'http://localhost:4444/wd/hub',

            params: {
                envType: 'local'
            }
        };
    },

    './test/reports/local/'
);
