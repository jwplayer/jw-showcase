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
                'images/{,*/}*.{jpg,gif,png}',
                'styles/fonts/{,*/}*.*'
            ]
        }]
    },
    styles: {
        expand: true,
        cwd:    '<%= config.app %>/styles',
        dest:   '.tmp/styles/',
        src:    '{,*/}*.css'
    }
};