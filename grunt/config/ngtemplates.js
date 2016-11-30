module.exports = {
    options: {
        module: 'app',
        url:    function (url) {
            return url.replace('bower_components/jw-showcase-lib/', '');
        }
    },
    server:  {
        src:  'bower_components/jw-showcase-lib/views/**/*.html',
        dest: '.tmp/scripts/templates.js'
    }
};