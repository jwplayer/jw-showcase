module.exports = {
    html:    '<%= config.app %>/index.html',
    options: {
        dest: '<%= config.dist %>',
        flow: {
            html: {
                steps: {
                    js:  ['concat', 'uglifyjs'],
                    css: ['cssmin']
                },
                post:  {}
            }
        }
    }
};