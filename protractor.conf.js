exports.config = {

    baseUrl: 'http://localhost:9001',

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ]
    },

    framework: 'custom',

    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 1,

    multiCapabilities: [
        createCapabilities({
            browserName: 'chrome'
        }, ['@desktop'])
    ],

    seleniumAddress: 'http://localhost:4444/wd/hub',

    specs: [
        'test/features/*.feature'
    ],

    onPrepare: function() {
        /* global browser */
        browser.driver.manage().window().maximize();
    }
};

/**
 * Add cucumber report output
 *
 * @param {Object} capabilities
 * @returns {Object}
 */
function createCapabilities (capabilities, tags) {

    capabilities.cucumberOpts = {
        format: 'json:./test/reports/' + composeReportName(capabilities) + '.json'
    };

    if (tags) {
        capabilities.cucumberOpts.tags = tags;
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
    var os = capabilities.os || 'host',
        osVersion = capabilities.os_version || '',
        browser = capabilities.browser || capabilities.browserName || 'default',
        browserVersion = capabilities.browserVersion || capabilities.browser_version || 'latest',

        name = os + ' ' + osVersion + ' - ' + browser + ' ' + browserVersion;

    if (capabilities.device) {
        name = capabilities.device + ' ' + name;
    }

    return name;
}