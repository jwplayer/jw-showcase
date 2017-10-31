var path = require('path');
var fs = require('fs');

var argv = {};
process.argv.forEach(function(value, key) {
    if (value.indexOf('--') === 0) {
        argv[value.replace('--', '')] = process.argv[++key].split(',');
    }
});

/**
 * Add cucumber report output
 *
 * @param {Object} capabilities
 * @returns {Object}
 */
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
    var device = metadata.device + (viewport ? ' @ ' + viewport : '');
    capabilities.metadata = {
        browser: {
            name: metadata.browser,
            version: metadata.browserVersion
        },
        device: device,
        platform: {
            name: metadata.os,
            version: metadata.osVersion
        }
    };

    // cucumber
    capabilities.cucumberOpts.format = ['progress', 'json:./test/reports/results.json'];
    capabilities.cucumberOpts.tags = tags;

    capabilities.name = metadata.browser + '_' + metadata.device + (viewport ? '_' + viewport : '');
    capabilities.logName = metadata.browser + '_' + metadata.device + (viewport ? '_' + viewport : '');

    return capabilities;
}

function getMetaData(capabilities) {
    var os              = capabilities.os || 'osx',
        osVersion       = capabilities.os_version || 'latest',
        browser         = capabilities.browser || capabilities.browserName || 'default',
        browserVersion  = capabilities.browserVersion || capabilities.browser_version || 'latest',
        device          = capabilities.device || capabilities.viewport || 'desktop',
        viewport        = capabilities.viewport || '';

    return {
        os,
        osVersion,
        browser,
        browserVersion,
        device,
        viewport
    };
}

const config = {
    baseUrl: 'http://localhost:9001',

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 10,

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ],
        format: ['progress', 'json:./test/reports/results.json']
    },

    seleniumAddress: 'http://localhost:4444/wd/hub',

    suites: {
        video: 'test/features/video.feature',
        search: 'test/features/search.feature',
        dashboard: 'test/features/dashboard.feature',
        watchProgress: 'test/features/watchProgress.feature',

        full: [
            'test/features/*.feature'
        ]
    },

    plugins: [
        {
            inline: {
                postResults: function() {
                    // remove empty result files
                    var resultPth = path.join(path.resolve('./test/reports/'), 'results.' + process.pid + '.json');

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
                reportPath: './test/reports/html'
            }
        }
    ],

    params: {
        envType: 'local'
    }
};

module.exports = {
    config,
    createCapabilities,
    argv
};
