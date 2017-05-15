/**
 * Copyright 2017 Longtail Ad Solutions Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 **/

module.exports = function (grunt) {

    var fs = require('fs');

    grunt.registerTask('serviceworker', function () {

        var dist = grunt.config.get('config.dist'),
            sw;

        // update sw.js
        sw = fs.readFileSync(dist + '/sw.js').toString();
        sw = sw.replace('/* inject:scripts */',
            '\'scripts/scripts.js\',' +
            '\'scripts/application.js\',' +
            '\'scripts/vendor.1.js\',' +
            '\'scripts/vendor.2.js\',' +
            '\'styles/vendor.css\''
        );

        sw = sw.replace(/[ ]+'config\.json',\n/, '');

        fs.writeFileSync(dist + '/sw.js', sw);
    });

};