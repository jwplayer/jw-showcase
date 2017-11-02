var { extendConfig } = require('./protractor.conf.base');

var browserstack = require('browserstack-local'),
    pkg          = require('./package.json'),
    env          = process.env,
    local;

exports.config = extendConfig(
    function(baseConfig, createCapabilities) {
        /**
         * Create BrowserStack capabilities
         *
         * @param   {Object}    capabilities    OS capabilities
         * @param   {Array}     [tags]          Optional cucumber tags
         *
         * @returns {Object} Capabilities
         */
        function createBrowserstackCapabilities (capabilities, tags) {
            capabilities = createCapabilities(capabilities, tags);

            capabilities['browserstack.user']  = env.BROWSERSTACK_USER || env.BS_USERNAME;
            capabilities['browserstack.key']   = env.BROWSERSTACK_KEY || env.BS_AUTHKEY;
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

        return {
            allScriptsTimeout: 30000,
            getPageTimeout:    30000,

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
            },

            multiCapabilities: [

                // //
                // // OS X
                // //

                // latest Firefox
                createBrowserstackCapabilities({
                    'browserName': 'firefox',
                    'os':          'OS X',
                    'os_version':  'Sierra'
                }, ['@desktop']),

                // latest Chrome
                createBrowserstackCapabilities({
                    'browserName': 'chrome',
                    'os':          'OS X',
                    'os_version':  'Sierra'
                }, ['@desktop']),

                // latest Safari
                createBrowserstackCapabilities({
                    'browserName': 'safari',
                    'os':          'OS X',
                    'os_version':  'Sierra'
                }, ['@desktop']),

                // Safari 9.1
                createBrowserstackCapabilities({
                    'browserName': 'safari',
                    'version':     '9.1',
                    'os':          'OS X',
                    'os_version':  'El Capitan'
                }, ['@desktop']),

                //
                // Windows
                //

                // Internet Explorer 11
                createBrowserstackCapabilities({
                    'browserName': 'internet explorer',
                    'version':     '11',
                    'os':          'WINDOWS',
                    'os_version':  '10'
                }, ['@desktop']),

                // latest Chrome
                createBrowserstackCapabilities({
                    'browserName': 'chrome',
                    'os':          'WINDOWS',
                    'os_version':  '10'
                }, ['@desktop']),

                // latest Firefox
                createBrowserstackCapabilities({
                    'browserName': 'firefox',
                    'os':          'WINDOWS',
                    'os_version':  '10'
                }, ['@desktop']),

                // last Edge
                createBrowserstackCapabilities({
                    'browserName': 'edge',
                    'os':          'WINDOWS',
                    'os_version':  '10'
                }, ['@desktop'])

            ]
        };
    },
    './test/reports/browserstack'
);
