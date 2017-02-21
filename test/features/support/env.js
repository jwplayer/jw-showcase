/**
 * Copyright 2015 Longtail Ad Solutions Inc.
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

var configure = function () {

    this.setDefaultTimeout(30 * 1000);

    this.After(function () {

        browser.clearMockModules();

        browser.executeScript(function () {
            try {
                window.localStorage.clear();
            } catch (e) {
            }
        });

    });

    this.Before(function () {

        if (!browser.browserName) {
            return browser
                .getCapabilities()
                .then(function (capabilities) {
                    browser.browserName = capabilities.get('browserName');
                });
        }
    });

    // set default config to config.json in fixtures directory
    this.Before(function () {

        return browser.addMockModule('app', function () {
            angular.module('app').run(function () {
                window.configLocation = './fixtures/config/config.json';
            });
        });
    });
};

module.exports = configure;