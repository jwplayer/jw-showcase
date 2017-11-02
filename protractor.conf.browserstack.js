var browserstack = require('browserstack-local');
var pkg = require('./package.json');
var env = process.env;
var local;

var extendConfig = require('./protractor/_base');

exports.config = extendConfig(
    function() {
        return {
            allScriptsTimeout: 60000,
            getPageTimeout:    60000,

            maxSessions: 2,

            seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',

            beforeLaunch: function () {
                return new Promise(function (resolve, reject) {
                    local = new browserstack.Local();
                    local.start({
                        'force': true,
                        'key':   env.BROWSERSTACK_KEY || env.BS_AUTHKEY
                    }, function (error) {
                        if (error) {
                            return reject(error);
                        }
                        resolve();
                    });
                });
            },

            afterLaunch: function () {
                return new Promise(function (resolve) {
                    local.stop(resolve);
                });
            }
        };
    },

    './test/reports/browserstack',

    function (capabilities) {
        capabilities['browserstack.user']  = env.BROWSERSTACK_USER || env.BROWSERSTACK_USERNAME || env.BS_USERNAME;
        capabilities['browserstack.key']   = env.BROWSERSTACK_KEY || env.BROWSERSTACK_ACCESS_KEY || env.BS_AUTHKEY;
        capabilities['browserstack.local'] = true;

        // Selenium 3.4.0 does not work great with IE11
        if (capabilities.browserName !== 'internet explorer') {
            capabilities['browserstack.selenium_version'] = '3.4.0';
        }

        capabilities.project = pkg.name;
        capabilities.build   = env.BROWSERSTACK_BUILD || pkg.version;

        if (capabilities.browserName === 'internet explorer') {
            capabilities.ignoreProtectedModeSettings = true;
        }

        return capabilities;
    }
);
