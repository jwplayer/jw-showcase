module.exports = function (grunt) {

    var fs             = require('fs'),
        url            = require('url'),
        template       = require('lodash.template'),
        pkg            = require(process.cwd() + '/package.json'),
        libPkg         = require(process.cwd() + '/bower_components/jw-showcase-lib/package.json'),
        mocksInclude   = ['bower_components/angular-mocks/angular-mocks.js',
                          'bower_components/firebase-mock/browser/firebasemock.js'];

    function compile (src, dest, configLocation, injectNgMocks) {

        var config   = require(process.cwd() + '/' + configLocation),
            baseUrl  = grunt.option('url') || '/',
            urlParts = url.parse(baseUrl),
            html, compiler, firstPartHtml, endPartHtml, injectedHtml;

        config.version    = pkg.version;
        config.libVersion = libPkg.version;

        config.pwa = grunt.option('pwa');

        html = fs.readFileSync(src).toString();

        if (injectNgMocks) {
            var pos             = html.indexOf('<!-- build:js({.tmp,app}) scripts/scripts.js -->');
            firstPartHtml       = html.substr(0, pos);
            endPartHtml         = html.substr(pos);
            injectedHtml        = '';

            mocksInclude.forEach(function (mockInclude) {
                injectedHtml += '<script src="' + mockInclude + '"></script>\n';
            });

            injectedHtml += '<script>window.name = "NG_DEFER_BOOTSTRAP!" + window.name;</script>' + '\n\n';

            html = firstPartHtml + injectedHtml + endPartHtml;
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
        var dist = grunt.config.get('config.dist');
        compile(dist + '/index.html', dist + '/index.html', dist + '/config.json');
    });
};
