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
            cwd:    'app/fonts',
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
            cwd:    'node_modules/sw-toolbox',
            src:    'sw-toolbox.js',
            dest:   '<%= config.dist %>'
        }]
    },
    server: {
        files: [{
            expand: true,
            cwd:    'app/fonts',
            dest:   '.tmp/fonts/',
            src:    '*'
        }, {
            expand: true,
            cwd:    'node_modules/sw-toolbox',
            src:    'sw-toolbox.js',
            dest:   '.tmp/'
        }]
    },
    styles: {
        expand: true,
        cwd:    '<%= config.app %>/styles',
        dest:   '.tmp/styles/',
        src:    '{,*/}*.css'
    },
    jsoneditor: {
        files: [{
            expand: true,
            dot: false,
            flatten: true,
            cwd: 'node_modules/jsoneditor',
            dest: '<%= config.dist %>/jsoneditor',
            src: [
                'dist/jsoneditor.min.css',
                'dist/jsoneditor.min.js',
                'examples/css/darktheme.css'
            ]
        }, {
            expand: true,
            dot: false,
            cwd: 'node_modules/jsoneditor/dist',
            dest: '<%= config.dist %>/jsoneditor/',
            src: 'img/{,*/}*'
        }]
    }
};
