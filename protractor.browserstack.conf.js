var pkg = require('./package.json'),
    env = process.env;

exports.config = {

    allScriptsTimeout: 20000,
    getPageTimeout: 20000,

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

    onPrepare: function() {
        /* global browser */
        browser.driver.manage().window().maximize();
    },

    multiCapabilities: [

        //
        // OS X
        //

        // latest Firefox
        createCapabilities({
            'browserName': 'firefox',
            'os':          'OS X',
            'os_version':  'El Capitan'
        }, ['@desktop']),

        // latest Chrome
        createCapabilities({
            'browserName': 'chrome',
            'os':          'OS X',
            'os_version':  'El Capitan'
        }, ['@desktop']),

        // latest Safari
        createCapabilities({
            'browserName': 'safari',
            'os':          'OS X',
            'os_version':  'El Capitan'
        }, ['@desktop']),

        // Safari 8
        createCapabilities({
            'browserName': 'safari',
            'browser_version': '8.0',
            'os':          'OS X',
            'os_version':  'Yosemite'
        }, ['@desktop']),

        //
        // Windows
        //

        // Internet Explorer 11
        createCapabilities({
            'browserName':     'internet explorer',
            'browser_version': '11',
            'os':              'WINDOWS',
            'os_version':      '10'
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

    capabilities['browserstack.user']  = env.BROWSERSTACK_USER || env.BS_USERNAME;
    capabilities['browserstack.key']   = env.BROWSERSTACK_KEY || env.BS_AUTHKEY;
    capabilities['browserstack.local'] = true;

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

    var name = 'e2e.',
        keys = ['os', 'os_version', 'browserName', 'browser', 'browserVersion', 'browser_version'];

    if (capabilities.device) {
        name += capabilities.device;
    }
    else {

        name += keys
            .map(function (key) {
                return capabilities[key];
            })
            .filter(function (value) {
                return typeof value === 'string';
            })
            .join('.');
    }

    return name.toLowerCase();
}
