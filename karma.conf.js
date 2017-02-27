
module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/ionic/js/ionic.js',
            'bower_components/ionic/js/ionic-angular.js',
            'bower_components/jw-showcase-lib/js/polyfills.js',
            'bower_components/jw-showcase-lib/js/core/core.module.js',
            'bower_components/jw-showcase-lib/js/core/**/*.js',
            'bower_components/jw-showcase-lib/views/**/*.html',
            'test/fixtures/feed/*.json',
            'test/fixtures/config/*.json',
            'test/unit/helpers/*.js',
            'test/unit/**/*.spec.js',
            {pattern: 'app/images/*', included: false, served: true}
        ],

        exclude: [
            'test/fixtures/config/invalidConfig.json'
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
