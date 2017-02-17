module.exports = {
    options: {
        module: 'app',
        url:    function (url) {
            return url.replace('bower_components/jw-showcase-lib/', '').replace('app/', '');
        }
    },
    server:  {
        src:  ['bower_components/jw-showcase-lib/views/**/*.html', 'app/views/**/*.html'],
        dest: '.tmp/scripts/templates.js'
    }
};