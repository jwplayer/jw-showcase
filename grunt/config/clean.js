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
    reports_local: [
        'test/reports/local/*.json',
        'test/reports/local/html',
        'test/reports/local/json-output-folder'
    ],
    reports_browserstack: [
        'test/reports/browserstack/*.json',
        'test/reports/browserstack/html',
        'test/reports/browserstack/json-output-folder'
    ]
};
