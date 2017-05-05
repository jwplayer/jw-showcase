module.exports = function (grunt) {

    var hosted = grunt.option('hosted'),
        tasks = [
            'clean:dist',
            'ngtemplates',
            'useminPrepare',
            'compass:dist',
            'concat',
            'copy:dist',
            'cssmin',
            'uglify',
            'usemin',
            'template:dist'
        ];

    if (hosted) {
        grunt.config.set('config.dist', 'hosted');
        tasks = tasks.concat(['hosted']);
    }

    grunt.registerTask('build', tasks);
};