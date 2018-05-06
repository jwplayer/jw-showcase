var path = require('path');
var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');

module.exports = function (grunt) {
    var ssl = grunt.option('ssl'),
        key,
        cert,
        ca;

    if (ssl) {
        key = grunt.file.read(path.resolve(ssl, 'server.key'));
        cert = grunt.file.read(path.resolve(ssl, 'server.crt'));
        ca = grunt.file.read(path.resolve(ssl, 'ca.crt'));
    }

    return {
        conf: {
            livereload: {
                host:       'localhost',
                protocol:   ssl ? 'https' : 'http',
                port:       35729,
                key:        key,
                cert:       cert,
                ca:         ca
            }
        },
        options:    {
            port:       9000,
            hostname:   'localhost',
            protocol:   ssl ? 'https' : 'http',
            key:        key,
            cert:       cert,
            ca:         ca,
            livereload: '<%= connect.conf.livereload.port %>'
        },
        livereload: {
            options: {
                open:       false,
                middleware: function (connect) {
                    return [
                        modRewrite(['^[^\\.]*$ /index.html [L]']),
                        serveStatic('.tmp'),
                        connect().use(
                            '/node_modules',
                            serveStatic('./node_modules')
                        ),
                        connect().use(
                            '/app',
                            serveStatic('./app')
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
                            '/node_modules',
                            serveStatic('./node_modules')
                        ),
                        connect().use(
                            '/app',
                            serveStatic('./app')
                        ),
                        serveStatic('./app')
                    ];
                }
            }
        }
    };
};
