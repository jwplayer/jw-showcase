var path = require('path');
var fs = require('fs');

var CAPABILITIES = require('./_caps');

var REPORT_FILENAME = 'results';

// process argv
var ARGV = {};
process.argv.forEach(function(value, key) {
    if (value.indexOf('--') === 0) {
        ARGV[value.replace('--', '')] = process.argv[++key].split(',');
    }
});

function getMetaData(capabilities) { // jshint ignore:line
    // jshint -W106
    var os              = capabilities.os || 'unknown',
        osVersion       = capabilities.os_version || 'latest',
        browser         = capabilities.browser || capabilities.browserName || 'unknown',
        browserVersion  = capabilities.browserVersion || capabilities.browser_version || 'latest',
        device          = capabilities.device || capabilities.viewport || 'desktop',
        viewport        = capabilities.viewport || '';
    // jshint +W106

    if (capabilities.viewport) {
        device += '_' + viewport;
    }

    // convert name for html-reporter
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

function getCukeFormat(reportPath, reportName = 'results') {
    return [ 'progress', 'json:' + path.join(reportPath, reportName + '.json') ];
}

function parseBrowserIds() {
    var allBrowserIds = Object.keys(CAPABILITIES);

    // get browsers from argv
    if (ARGV.browser) {
        // default
        var ret = [];

        // ensure array
        var args = typeof ARGV.browser === 'string' ? [ARGV.browser] : ARGV.browser;

        args.forEach(function (arg) {
            // if wildcard
            if (arg.indexOf('*') !== -1) {
                var regex = new RegExp(arg.replace('*', '.*'));
                // check matches
                allBrowserIds.forEach(function (browserId) {
                    if (browserId.match(regex)) {
                        ret.push(browserId);
                    }
                });
            } else {
                ret.push(arg);
            }
        });

        // unique array
        ret = ret.filter((v, k, self) => self.indexOf(v) === k);

        return ret;
    } else {
        return allBrowserIds;
    }
}

function extendConfig(callback, reportPath, customCapabilities) {
    var browserIds = parseBrowserIds();

    console.log(`\nBROWSER IDS\n${JSON.stringify(browserIds, null, 2)}\n`);

    function createCapabilities (id) {
        var cap = CAPABILITIES[id];
        if (!cap) {
            return;
        }

        var [ capabilities, tags, viewport ] = cap;

        // add viewport meta and tags if needed
        if (viewport) {
            capabilities.viewport = viewport;

            // push tag
            tags.push('@desktop-screen-' + viewport);
        }

        // fill metadata for html-reporter
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
        if (!capabilities.cucumberOpts) {
            capabilities.cucumberOpts = {};
        }
        capabilities.cucumberOpts.format = getCukeFormat(reportPath);
        capabilities.cucumberOpts.tags = tags;

        capabilities.name = id;
        capabilities.logName = id;

        return customCapabilities ? customCapabilities(capabilities) : capabilities;
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
            format: getCukeFormat(reportPath)
        },

        seleniumAddress: 'http://localhost:4444/wd/hub',

        suites: {
            video: 'test/features/video.feature',
            search: 'test/features/search.feature',
            dashboard: 'test/features/dashboard.feature',
            watchProgress: 'test/features/watchProgress.feature',
            watchlist: 'test/features/watchlist.feature',
            siderail: 'test/features/siderail.feature',
            experimental: 'test/features/experimental.feature',

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
                        var resultPth = path.join(
                            path.resolve(reportPath),
                            REPORT_FILENAME + '.' + process.pid + '.json'
                        );

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
        ],

        multiCapabilities: browserIds.map(createCapabilities).filter(function (cap) {
            return !!cap;
        })
    };

    // merge objects
    var customConfig = callback(baseConfig, createCapabilities);
    return Object.assign({}, baseConfig, customConfig);
}

module.exports = extendConfig;
