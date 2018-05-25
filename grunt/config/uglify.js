module.exports = function(grunt) {
    return {
        options: {
            preserveComments: 'some',
            compress: !grunt.option('dev'),
            mangle: !grunt.option('dev'),
            beautify: grunt.option('dev')
        }
    }
};
