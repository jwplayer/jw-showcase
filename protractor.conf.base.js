var path = require('path');
var fs = require('fs');

// process argv
var argv = {};
process.argv.forEach(function(value, key) {
    if (value.indexOf('--') === 0) {
        argv[value.replace('--', '')] = process.argv[++key].split(',');
    }
});

var REPORT_FILENAME = 'results';

function getMetaData(capabilities) {
    var os              = capabilities.os || 'osx',
        osVersion       = capabilities.os_version || 'latest',
        browser         = capabilities.browser || capabilities.browserName || 'default',
        browserVersion  = capabilities.browserVersion || capabilities.browser_version || 'latest',
        device          = capabilities.device || capabilities.viewport || 'desktop',
        viewport        = capabilities.viewport || '';

    if (capabilities.viewport) {
        device += '_' + viewport;
    }

    switch(os) {
    case 'MAC':
    case 'OS X':
    case 'OSX':
        os = 'osx';
        break;
    case 'WINDOWS':
    case 'WIN10':
        os = 'windows';
        break;
    }

    return {
        os,
        osVersion,
        browser,
        browserVersion,
        device,
        viewport
    };
}

function extendConfig(callback, reportPath) {
    function createCapabilities (capabilities, tags, viewport) {
        if (!capabilities.cucumberOpts) {
            capabilities.cucumberOpts = {};
        }

        if (viewport) {
            capabilities.viewport = viewport;

            // push tag
            tags.push('@desktop-screen-' + viewport);
        }

        // fill metadata
        var metadata = getMetaData(capabilities);
        capabilities.metadata = {
            browser: {
                name: metadata.browser,
                version: metadata.browserVersion
            },
            device: metadata.device,
            platform: {
                name: metadata.os,
                version: metadata.osVersion
            }
        };

        // cucumber
        capabilities.cucumberOpts.format = ['progress', 'json:' + path.join(reportPath, REPORT_FILENAME + '.json')];
        capabilities.cucumberOpts.tags = tags;

        capabilities.name = metadata.browser + '_' + metadata.device;
        capabilities.logName = metadata.browser + '_' + metadata.device;

        return capabilities;
    }

    var baseConfig = {
        baseUrl: 'http://localhost:9001',

        framework: 'custom',
        frameworkPath: require.resolve('protractor-cucumber-framework'),

        maxSessions: 1,

        cucumberOpts: {
            require: [
                'test/features/support/**/*.js',
                'test/features/step_definitions/**/*.js'
            ],
            format: ['progress', 'json:' + path.join(reportPath, REPORT_FILENAME + '.json')]
        },

        seleniumAddress: 'http://localhost:4444/wd/hub',

        suites: {
            video: 'test/features/video.feature',
            search: 'test/features/search.feature',
            dashboard: 'test/features/dashboard.feature',
            watchProgress: 'test/features/watchProgress.feature',
            watchlist: 'test/features/watchlist.feature',
            siderail: 'test/features/siderail.feature',

            full: [
                'test/features/*.feature'
            ]
        },

        onPrepare: function () {
            /* global browser */
            browser.driver.manage().window().maximize();
        },

        plugins: [
            {
                inline: {
                    postResults: function() {
                        // remove empty result files
                        var resultPth = path.join(path.resolve(reportPath), REPORT_FILENAME + '.' + process.pid + '.json');

                        var res = require(resultPth);
                        if (!(res && res.length)) {
                            fs.unlinkSync(resultPth);
                        }
                    }
                }
            },
            {
                package: 'protractor-multiple-cucumber-html-reporter-plugin',
                options: {
                    automaticallyGenerateReport: true,
                    removeExistingJsonReportFile: false,
                    saveCollectedJSON: false,
                    reportPath: path.join(reportPath, 'html')
                }
            }
        ]
    };

    // merge objects
    var customConfig = callback(baseConfig, createCapabilities);
    return Object.assign({}, baseConfig, customConfig);
}

module.exports = {
    extendConfig,
    argv
};
