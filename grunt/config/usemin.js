module.exports = {
    html:    ['<%= config.dist %>/{,*/}*.html'],
    css:     ['<%= config.dist %>/styles/{,*/}*.css'],
    options: {
        assetsDirs: [
            '<%= config.dist %>',
            '<%= config.dist %>/images',
            '<%= config.dist %>/styles'
        ]
    }
};