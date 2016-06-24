module.exports = {
    options: {
        module: 'app',
        url:    function (url) {
            return url.replace('app/', '');
        }
    },
    server:  {
        src:  '<%= config.app %>/views/**/*.html',
        dest: '.tmp/scripts/templates.js'
    }
};