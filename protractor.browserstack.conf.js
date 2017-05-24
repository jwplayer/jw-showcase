var browserstack = require('browserstack-local'),
    pkg          = require('./package.json'),
    env          = process.env,
    local;

exports.config = {

    allScriptsTimeout: 30000,
    getPageTimeout:    30000,

    baseUrl: 'http://localhost:9001',

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ]
    },

    framework: 'custom',

    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 2,

    seleniumAddress: 'http://hub.browserstack.com/wd/hub',

    specs: [
        'test/features/*.feature'
    ],

    onPrepare: function () {
        /* global browser */
        browser.driver.manage().window().maximize();
    },

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
        return new Promise(function (resolve, reject) {
            local.stop(resolve);
        });
    },

    multiCapabilities: [

        //
        // OS X
        //

        // latest Firefox
        createCapabilities({
            'browserName': 'firefox',
            'os':          'OS X',
            'os_version':  'Sierra'
        }, ['@desktop']),

        // latest Chrome
        createCapabilities({
            'browserName': 'chrome',
            'os':          'OS X',
            'os_version':  'Sierra'
        }, ['@desktop']),

        // latest Safari
        createCapabilities({
            'browserName': 'safari',
            'os':          'OS X',
            'os_version':  'Sierra'
        }, ['@desktop']),

        // Safari 9.1
        createCapabilities({
            'browserName': 'safari',
            'version':     '9.1',
            'os':          'OS X',
            'os_version':  'El Capitan'
        }, ['@desktop']),

        //
        // Windows
        //

        // Internet Explorer 11
        createCapabilities({
            'browserName': 'internet explorer',
            'version':     '11',
            'os':          'WINDOWS',
            'os_version':  '10'
        }, ['@desktop']),

        // latest Chrome
        createCapabilities({
            'browserName': 'chrome',
            'os':          'WINDOWS',
            'os_version':  '10'
        }, ['@desktop']),

        // latest Firefox
        createCapabilities({
            'browserName': 'firefox',
            'os':          'WINDOWS',
            'os_version':  '10'
        }, ['@desktop'])
    ]
};

/**
 * Create BrowserStack capabilities
 *
 * @param   {Object}    capabilities    OS capabilities
 * @param   {Array}     [tags]          Optional cucumber tags
 *
 * @returns {Object} Capabilities
 */
function createCapabilities (capabilities, tags) {

    capabilities['browserstack.user']             = env.BROWSERSTACK_USER || env.BS_USERNAME;
    capabilities['browserstack.key']              = env.BROWSERSTACK_KEY || env.BS_AUTHKEY;
    capabilities['browserstack.local']            = true;

    // Selenium 3.4.0 does not work great with IE11
    if (capabilities.browserName !== 'internet explorer') {
        capabilities['browserstack.selenium_version'] = '3.4.0';
    }

    capabilities.project = pkg.name;
    capabilities.build   = env.BROWSERSTACK_BUILD || pkg.version;

    capabilities.cucumberOpts = {
        format: 'json:./test/reports/' + composeReportName(capabilities) + '.json'
    };

    if (tags) {
        capabilities.cucumberOpts.tags = tags;
    }

    if (capabilities.browserName === 'internet explorer') {
        capabilities.ignoreProtectedModeSettings = true;
    }

    return capabilities;
}

/**
 * Compose report name based on given capabilities object
 *
 * @param   {Object}    capabilities    Capabilities
 *
 * @returns {string} Report name
 */
function composeReportName (capabilities) {

    /*jshint camelcase: false */
    var os             = capabilities.os,
        osVersion      = capabilities.os_version || '',
        browser        = capabilities.browser || capabilities.browserName || 'default',
        browserVersion = capabilities.browserVersion || capabilities.version || 'latest',

        name           = os + ' ' + osVersion + ' - ' + browser + ' ' + browserVersion;

    if (capabilities.device) {
        name = capabilities.device + ' ' + name;
    }

    return name;
}
