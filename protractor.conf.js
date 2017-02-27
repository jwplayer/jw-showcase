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
    ]

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
        format: 'json:./test/reports/e2e.' + capabilities.browserName + '.json'
    };

    if (tags) {
        capabilities.cucumberOpts.tags = tags;
    }

    return capabilities;
}