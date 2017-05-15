
module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/ua-parser-js/dist/ua-parser.pack.js',
            'bower_components/jw-showcase-lib/js/polyfills.js',
            'bower_components/jw-showcase-lib/js/vtt.js',
            'bower_components/jw-showcase-lib/js/core/core.module.js',
            'bower_components/jw-showcase-lib/js/core/**/*.js',
            'bower_components/jw-showcase-lib/views/**/*.html',
            'test/fixtures/feed/*.json',
            'test/fixtures/config/**/*.json',
            'test/unit/helpers/*.js',
            'test/unit/specs/**/*.spec.js',
            {pattern: 'app/images/*', included: false, served: true}
        ],

        exclude: [
            'test/fixtures/config/v1/invalid.json',
            'test/fixtures/config/invalid.json'
        ],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'bower_components/jw-showcase-lib/',
            moduleName:  'app.partials'
        },

        jsonFixturesPreprocessor: {
            stripPrefix: 'test/fixtures/'
        },

        preprocessors: {
            '**/*.html':                 ['ng-html2js'],
            'test/fixtures/**/*.json':   ['json_fixtures']
        },

        reporters: ['dots'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: true,

        concurrency: Infinity
    });
};
