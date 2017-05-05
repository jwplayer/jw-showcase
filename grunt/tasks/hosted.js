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

    grunt.registerTask('hosted', function () {

        var prefix = grunt.option('prefix') || 'a',
            output = 'hosted/' + prefix,
            html, sw, application;

        fs.mkdirSync(output);

        // move assets
        fs.renameSync('hosted/fonts', output + '/fonts');
        fs.renameSync('hosted/scripts', output + '/scripts');
        fs.renameSync('hosted/styles', output + '/styles');
        fs.renameSync('hosted/images', output + '/images');
        fs.renameSync('hosted/favicon.ico', output + '/favicon.ico');

        fs.renameSync('hosted/sw.js', output + '/sw.js');
        fs.renameSync('hosted/ranged-request.js', output + '/ranged-request.js');
        fs.renameSync('hosted/sw-toolbox.js', output + '/sw-toolbox.js');

        // test only
        // fs.renameSync('hosted/config.json', output + '/config.json');
        // fs.renameSync('hosted/manifest.json', output + '/manifest.json');

        fs.unlinkSync('hosted/config.json');
        fs.unlinkSync('hosted/manifest.json');

        fs.unlinkSync('hosted/.htaccess');
        fs.unlinkSync('hosted/robots.txt');

        // update index html
        html = fs.readFileSync('hosted/index.html').toString();

        html = html.replace(/scripts\//g, prefix + '/scripts/');
        html = html.replace(/styles\//g, prefix + '/styles/');
        html = html.replace('./config.json', prefix + '/config.json');
        html = html.replace('favicon.ico', prefix + '/favicon.ico');
        html = html.replace('sw.js', prefix + '/sw.js');

        // enable PWA for hosted build
        html = html.replace('window.enablePwa = false;', 'window.enablePwa = true;');

        fs.writeFileSync('hosted/index.html', html);

        // update sw.js
        sw = fs.readFileSync(output + '/sw.js').toString();
        sw = sw.replace('/* inject:scripts */',
            '\'/scripts/scripts.js\',' +
            '\'/scripts/application.js\',' +
            '\'/scripts/vendor.1.js\',' +
            '\'/scripts/vendor.2.js\''
        );

        fs.writeFileSync(output + '/sw.js', sw);

        // update application.js
        application = fs.readFileSync(output + '/scripts/application.js').toString();

        application = application.replace(/\{url:"\/list/g, '{url:"/' + prefix + '/list');
        application = application.replace(/\{url:"\/search/g, '{url:"/' + prefix + '/search');
        application = application.replace(/\{url:"\/video-not-found'/g, '{url:"/' + prefix + '/video-not-found');
        application = application.replace(/\{url:"\/list-not-found'/g, '{url:"/' + prefix + '/list-not-found');

        fs.writeFileSync(output + '/scripts/application.js', application);
    });

    function deleteFolderRecursive (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    function copyFolderRecursive (src, dist) {
        if (fs.existsSync(src)) {

            if (!fs.existsSync(dist)) {
                fs.mkdirSync(dist);
            }

            fs.readdirSync(src).forEach(function (file, index) {
                var curPath  = src + '/' + file,
                    destPath = dist + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    copyFolderRecursive(curPath, destPath);
                }
                else {
                    fs.writeFileSync(destPath, fs.readFileSync(curPath));
                }
            });
        }
    }
};