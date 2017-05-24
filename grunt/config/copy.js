module.exports = {
    dist:   {
        files: [{
            expand: true,
            dot:    true,
            cwd:    '<%= config.app %>',
            dest:   '<%= config.dist %>',
            src:    [
                '*.{ico,png,txt}',
                '.htaccess',
                'config.json',
                '*.html',
                'fonts/{,*/}*',
                'images/*.{jpg,gif,png,svg}',
                'styles/fonts/{,*/}*.*'
            ]
        }, {
            expand: true,
            cwd:    'bower_components/jw-showcase-lib/fonts',
            dest:   '<%= config.dist %>/fonts',
            src:    '*'
        }, {
            expand: true,
            dest:   '<%= config.dist %>',
            src:    ['README.md', 'CHANGELOG.md']
        }]
    },
    pwa: {
        files: [{
            expand: true,
            dot:    true,
            cwd:    '<%= config.app %>',
            dest:   '<%= config.dist %>',
            src:    [
                'images/*/*.{jpg,gif,png,svg}',
                'manifest.json',
                '*.js'
            ]
        }, {
            expand: true,
            cwd:    'bower_components/sw-toolbox',
            src:    'sw-toolbox.js',
            dest:   '<%= config.dist %>'
        }]
    },
    server: {
        files: [{
            expand: true,
            cwd:    'bower_components/jw-showcase-lib/fonts',
            dest:   '.tmp/fonts/',
            src:    '*'
        }, {
            expand: true,
            cwd:    'bower_components/sw-toolbox',
            src:    'sw-toolbox.js',
            dest:   '.tmp/'
        }]
    },
    styles: {
        expand: true,
        cwd:    '<%= config.app %>/styles',
        dest:   '.tmp/styles/',
        src:    '{,*/}*.css'
    }
};