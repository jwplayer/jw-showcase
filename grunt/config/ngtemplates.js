module.exports = {
    options: {
        module: 'app',
        url:    function (url) {
            return url.replace('node_modules/jw-showcase-lib/', '').replace('app/', '');
        }
    },
    server:  {
        src:  ['node_modules/jw-showcase-lib/views/**/*.html', 'app/views/**/*.html'],
        dest: '.tmp/scripts/templates.js'
    }
};
