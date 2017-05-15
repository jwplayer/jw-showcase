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

        var prefix   = grunt.option('prefix') || 'a',
            fromDist = grunt.config.get('config.dist'),
            toDist   = fromDist + '/' + prefix,
            html, sw, application;

        fs.mkdirSync(toDist);

        // move assets
        fs.renameSync(fromDist + '/fonts', toDist + '/fonts');
        fs.renameSync(fromDist + '/scripts', toDist + '/scripts');
        fs.renameSync(fromDist + '/styles', toDist + '/styles');
        fs.renameSync(fromDist + '/images', toDist + '/images');
        fs.renameSync(fromDist + '/favicon.ico', toDist + '/favicon.ico');

        ifExists(fromDist + '/sw.js', toDist + '/sw.js', fs.renameSync);
        ifExists(fromDist + '/ranged-request.js', toDist + '/ranged-request.js', fs.renameSync);
        ifExists(fromDist + '/sw-toolbox.js', toDist + '/sw-toolbox.js', fs.renameSync);

        ifExists(fromDist + '/manifest.json', fs.unlinkSync);

        fs.unlinkSync(fromDist + '/config.json');
        fs.unlinkSync(fromDist + '/.htaccess');
        fs.unlinkSync(fromDist + '/robots.txt');

        // update index html
        html = fs.readFileSync(fromDist + '/index.html').toString();

        html = html.replace(/scripts\//g, prefix + '/scripts/');
        html = html.replace(/styles\//g, prefix + '/styles/');
        html = html.replace('./config.json', prefix + '/config.json');
        html = html.replace('favicon.ico', prefix + '/favicon.ico');
        html = html.replace('sw.js\'', prefix + '/sw.js\', {scope: \'/\'}');
        html = html.replace('manifest.json', prefix + '/manifest.json');

        fs.writeFileSync(fromDist + '/index.html', html);

        // update application.js
        application = fs.readFileSync(toDist + '/scripts/application.js').toString();

        application = application.replace(/\{url:"\/list/g, '{url:"/' + prefix + '/list');
        application = application.replace(/\{url:"\/search/g, '{url:"/' + prefix + '/search');
        application = application.replace(/\{url:"\/video-not-found'/g, '{url:"/' + prefix + '/video-not-found');
        application = application.replace(/\{url:"\/list-not-found'/g, '{url:"/' + prefix + '/list-not-found');

        fs.writeFileSync(toDist + '/scripts/application.js', application);
    });

    function ifExists () {

        var args = Array.prototype.slice.call(arguments),
            fn   = args.pop();

        if (fs.existsSync(args[0])) {
            fn.apply(this, args);
        }
    }

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