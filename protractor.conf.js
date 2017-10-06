exports.config = {

    baseUrl: 'http://localhost:9001',

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ],

        /**
         * Ability to define a single scenario for developing tests
         * @type  {String}
         */
        // name: 'As a mobile user I want the player to convert to a floating mini player when I leave the video page'
    },

    framework: 'custom',

    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 1,

    multiCapabilities: [
        // desktop screensize independent
        createCapabilities({
            browserName: 'chrome'
        }, ['@desktop']),

        // desktop different screen sizes
        createCapabilities({
            browserName: 'chrome'
        }, ['@desktop-screen-desktop'], 'desktop'),

        createCapabilities({
            browserName: 'chrome'
        }, ['@desktop-screen-tablet'], 'tablet'),

        createCapabilities({
            browserName: 'chrome'
        }, ['@desktop-screen-mobile'], 'mobile'),

        // chrome iPhone emulation
        createCapabilities({
            browserName: 'chrome',
            chromeOptions: {
                mobileEmulation: {
                    deviceName: 'iPhone 6'
                }
            }
        }, ['@mobile'])
    ],

    seleniumAddress: 'http://localhost:4444/wd/hub',

    suites: {
        video: 'test/features/video.feature',
        full: [
            'test/features/*.feature'
        ]
    },

    onPrepare: function() {
        /* global browser */
        return browser.getProcessedConfig().then(function(config) {
            var screenSize = config.capabilities.screenSize || 'desktop';

            switch (screenSize) {
            case 'mobile':
                browser.driver.manage().window().setSize(480, 600);
                break;
            case 'tablet':
                browser.driver.manage().window().setSize(992, 600);
                break;
            default:
                browser.driver.manage().window().maximize();
                break;
            }
        });
    }
};

/**
 * Add cucumber report output
 *
 * @param {Object} capabilities
 * @returns {Object}
 */
function createCapabilities (capabilities, tags, screenSize) {
    if (screenSize) {
        capabilities.screenSize = screenSize;

        // push tag
        tags.push('@desktop-screen-' + screenSize);
    }

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
