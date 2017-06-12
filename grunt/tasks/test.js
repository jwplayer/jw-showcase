var ngrok = require('ngrok');

module.exports = function (grunt) {

    grunt.registerTask('test:unit', [
        'karma'
    ]);

    grunt.registerTask('test:protractor', function () {
        // set configFile variable based on config option, default to local protractor config.
        grunt.config.set('configFile', grunt.option('config') || 'protractor.conf.js');
        runProtractorTasks();
    });

    // don't break existing tasks
    grunt.registerTask('test:protractor:local', function () {
        grunt.config.set('configFile', 'protractor.conf.js');
        runProtractorTasks();
    });

    grunt.registerTask('test:protractor:browserstack', function () {
        grunt.config.set('configFile', 'protractor.browserstack.conf.js');
        runProtractorTasks();
    });

    grunt.registerTask('test:protractor:mobile', function () {
        grunt.config.set('configFile', 'protractor.mobile.conf.js');

        if (!process.env.JENKINS_URL) {
            return runProtractorTasks();
        }

        var done = this.async();

        grunt.log.writeln('> Starting local tunnel...')

        ngrok.connect(9001, function (error, url) {
            if (error) {
                return reject(error);
            }

            grunt.log.writeln('> Local tunnel running on ' + url + '!');

            grunt.config.set('protractor.options.args', {baseUrl: url});

            runProtractorTasks();

            done();
        });
    });

    grunt.registerTask('test:server', [
        'clean:server',
        'clean:reports',
        'compass',
        'ngtemplates:server',
        'template:serverE2E',
        'copy:server',
        'connect:test'
    ]);

    function runProtractorTasks () {

        if (grunt.option('no-server')) {
            return grunt.task.run(['protractor:run']);
        }

        grunt.task.run([
            'test:server',
            'protractor:run'
        ]);
    }
};
