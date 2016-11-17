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
                'images/{,*/}*.{jpg,gif,png,svg}',
                'styles/fonts/{,*/}*.*'
            ]
        }, {
            expand: true,
            cwd:    'bower_components/jw-showcase-lib/fonts',
            dest:   '<%= config.dist %>/fonts',
            src:    '*'
        }]
    },
    icons:  {
        expand: true,
        cwd:    'bower_components/jw-showcase-lib/fonts',
        dest:   '.tmp/fonts/',
        src:    '*'
    },
    styles: {
        expand: true,
        cwd:    '<%= config.app %>/styles',
        dest:   '.tmp/styles/',
        src:    '{,*/}*.css'
    }
};