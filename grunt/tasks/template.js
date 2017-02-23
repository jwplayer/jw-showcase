module.exports = function (grunt) {

    var fs             = require('fs'),
        url            = require('url'),
        template       = require('lodash.template'),
        pkg            = require(process.cwd() + '/package.json'),
        libPkg         = require(process.cwd() + '/bower_components/jw-showcase-lib/package.json'),
        ngMocksInclude = '<script src="bower_components/angular-mocks/angular-mocks.js"></script>';

    function compile (src, dest, configLocation, injectNgMocks) {

        var config   = require(process.cwd() + '/' + configLocation),
            baseUrl  = grunt.option('url') || '/',
            urlParts = url.parse(baseUrl),
            html, compiler;

        config.version    = pkg.version;
        config.libVersion = libPkg.version;

        html = fs.readFileSync(src).toString();

        if (injectNgMocks) {
            var pos = html.indexOf('<!-- build:js({.tmp,app}) scripts/scripts.js -->');
            html = html.substr(0, pos) + ngMocksInclude + '\n\n' + html.substr(pos);

        }

        compiler = template(html);

        config.path = urlParts.path;
        config.url  = baseUrl;

        if (config.path.slice(-1) !== '/') {
            config.path += '/';
        }

        if (config.url.slice(-1) !== '/') {
            config.url += '/';
        }

        fs.writeFileSync(dest, compiler(config));
    }

    // process.cwd() + '/dist/config.json'

    grunt.registerTask('template:server', function () {
        compile('./app/index.html', './.tmp/index.html', './app/config.json');
    });

    grunt.registerTask('template:serverE2E', function () {
        compile('./app/index.html', './.tmp/index.html', './app/config.json', true);
    });

    grunt.registerTask('template:dist', function () {
        compile('./dist/index.html', './dist/index.html', './dist/config.json');
    });
};