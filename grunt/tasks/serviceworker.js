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

    function copySw(dest) {
        var app = grunt.config.get('config.app');

        var sw = fs.readFileSync(app + '/sw.js').toString();

        // inject vendor scripts
        sw = sw.replace(
            '/* inject:vendorscripts */',
            [
                'node_modules/sw-toolbox/sw-toolbox.js',
                app + '/ranged-request.js'
            ].map(
                function (pth) {
                    return fs.readFileSync(pth).toString().replace(/\/\/# ?sourceMappingURL.*/, '');
                }
            ).join('\n')
        );

        sw = sw.replace(/[ ]+'config\.json',\n/, '');

        fs.writeFileSync(dest + '/sw.js', sw);
    }

    grunt.registerTask('serviceworker', function () {
        var dist = grunt.config.get('config.dist');
        copySw(dist);
    });
};
