'use strict';

module.exports = function (grunt) {

    var path = require('path');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var config = {
        app:  'app',
        dist: 'dist'
    };

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        data:       {
            configFile: 'protractor.conf.local.js',
            config:     config,
            pkg:        require('./package.json')
        }
    });

    grunt.loadTasks('./grunt/tasks');
};
