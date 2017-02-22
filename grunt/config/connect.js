var modRewrite = require('connect-modrewrite');

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
                        connect.static('.tmp'),
                        connect().use(
                            '/bower_components',
                            connect.static('./bower_components')
                        ),
                        connect().use(
                            '/app/styles',
                            connect.static('./app/styles')
                        ),
                        connect.static('./app')
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
                        connect.static('.tmp'),
                        connect.static('test'),
                        connect().use(
                            '/bower_components',
                            connect.static('./bower_components')
                        ),
                        connect.static('./app')
                    ];
                }
            }
        }
    };
};