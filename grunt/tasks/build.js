module.exports = function (grunt) {

    grunt.registerTask('build', [
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
    ]);
};