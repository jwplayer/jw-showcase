/**
 * Add cucumber report output
 *
 * @param {Object} capabilities
 * @returns {Object}
 */
function createCapabilities (capabilities, tags, screenSize) {
    if (!capabilities.cucumberOpts) {
        capabilities.cucumberOpts = {};
    }

    if (screenSize) {
        capabilities.screenSize = screenSize;

        // push tag
        tags.push('@desktop-screen-' + screenSize);
    }

    capabilities.cucumberOpts.format = 'json:./test/reports/' + composeReportName(capabilities) + '.json';

    capabilities.cucumberOpts.tags = tags;

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

const config = {
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

    seleniumAddress: 'http://localhost:4444/wd/hub',

    suites: {
        video: 'test/features/video.feature',
        full: [
            'test/features/*.feature'
        ]
    }
};

module.exports = {
    config,
    createCapabilities
};
