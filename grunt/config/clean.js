module.exports = {
    dist:   {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= config.dist %>/{,*/}*',
                '!<%= config.dist %>/.git{,*/}*'
            ]
        }]
    },
    server: '.tmp',
    reports: ['test/reports/*.json', 'test/reports/html', 'test/reports/json-output-folder']
};
