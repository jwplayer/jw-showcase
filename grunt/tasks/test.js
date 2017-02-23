module.exports = function (grunt) {

    grunt.registerTask('test:unit', [
        'clean:server',
        'compass',
        'ngtemplates:server',
        'template:server',
        'connect:test',
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

    grunt.registerTask('test:server', [
        'clean:server',
        'clean:reports',
        'compass',
        'ngtemplates:server',
        'template:serverE2E',
        'copy:icons',
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