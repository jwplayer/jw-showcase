const DEBUG = process.argv.indexOf('--debug') !== -1;

module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: [ 'jasmine' ],

        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-touch/angular-touch.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/ua-parser-js/dist/ua-parser.pack.js',
            'node_modules/jw-showcase-lib/js/polyfills.js',
            'node_modules/jw-showcase-lib/js/vtt.js',
            'node_modules/jw-showcase-lib/js/core/core.module.js',
            'node_modules/jw-showcase-lib/js/core/**/*.js',
            'node_modules/jw-showcase-lib/views/**/*.html',
            'test/fixtures/feed/*.json',
            'test/fixtures/config/**/*.json',
            'test/unit/helpers/*.js',
            'test/unit/specs/**/*.spec.js',
            {
                pattern: 'app/images/*', included: false, served: true
            }
        ],

        exclude: [
            'test/fixtures/config/v1/invalid.json',
            'test/fixtures/config/invalid.json'
        ],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'node_modules/jw-showcase-lib/',
            moduleName:  'app.partials'
        },

        jsonFixturesPreprocessor: {
            stripPrefix: 'test/fixtures/'
        },

        preprocessors: {
            '**/*.html':                 [ 'ng-html2js' ],
            'test/fixtures/**/*.json':   [ 'json_fixtures' ]
        },

        reporters: [ 'dots' ],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: [ 'PhantomJS' ],

        singleRun: true,

        concurrency: Infinity
    });

    if (DEBUG) {
        config.set({
            // Allow remote debugging when using PhantomJS
            customLaunchers: {
                'PhantomJS_custom': {
                    base: 'PhantomJS',
                    debug: true
                },
            },

            singleRun: false
        });
    }
};
