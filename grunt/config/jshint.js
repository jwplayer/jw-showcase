module.exports = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all:     {
        src: [
            'Gruntfile.js',
            '<%= config.app %>/scripts/{,*/}*.js'
        ]
    }
};