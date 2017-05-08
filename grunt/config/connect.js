var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');

module.exports = function (grunt) {
    return {
        options:    {
            port:       9000,
            hostname:   '0.0.0.0',
            livereload: 35729
        },
        livereload: {
            options: {
                open:       true,
                middleware: function (connect) {
                    return [
                        modRewrite(['^[^\\.]*$ /index.html [L]']),
                        serveStatic('.tmp'),
                        connect().use(
                            '/bower_components',
                            serveStatic('./bower_components')
                        ),
                        serveStatic('./app')
                    ];
                }
            }
        },
        test:       {
            options: {
                port:       9001,
                livereload: false,
                keepalive:  !!grunt.option('keepalive'),
                middleware: function (connect) {
                    return [
                        modRewrite(['^[^\\.]*$ /index.html [L]']),
                        serveStatic('.tmp'),
                        serveStatic('test'),
                        connect().use(
                            '/bower_components',
                            serveStatic('./bower_components')
                        ),
                        serveStatic('./app')
                    ];
                }
            }
        }
    };
};