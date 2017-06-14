var browserstack = require('browserstack-local'),
    pkg          = require('./package.json'),
    env          = process.env;

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

    seleniumAddress: env.MOBILE_HUB_ADDRESS,

    specs: [
        'test/features/*.feature'
    ],

    onPrepare: function () {
        /* global browser */
        browser.driver.manage().window().maximize();
    },

    multiCapabilities: [

        //
        // iOS
        //
        createCapabilities({
            sessionName:        'Automation test session',
            sessionDescription: '',
            deviceOrientation:  'portrait',
            captureScreenshots: false,
            browserName:        'safari',
            deviceGroup:        'KOBITON',
            deviceName:         'iPhone 6s',
            platformVersion:    '10.1.1',
            platformName:       'iOS'
        }, ['@mobile']),

        //
        // Android
        //
        createCapabilities({
            sessionName:        'Automation test session',
            sessionDescription: '',
            deviceOrientation:  'portrait',
            captureScreenshots: true,
            browserName:        'chromebeta',
            deviceGroup:        'KOBITON',
            deviceName:         'Galaxy S7 Edge',
            platformVersion:    '6.0.1',
            platformName:       'Android'
        }, ['@mobile'])
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
    var os             = capabilities.platformName,
        osVersion      = capabilities.platformVersion || '',
        browser        = capabilities.browser || capabilities.browserName || 'default',
        browserVersion = capabilities.browserVersion || capabilities.version || 'latest',

        name           = os + ' ' + osVersion + ' - ' + browser + ' ' + browserVersion;

    if (capabilities.device) {
        name = capabilities.device + ' ' + name;
    }

    return name;
}
