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

const
    {defineSupportCode} = require('cucumber');

defineSupportCode(function ({After, Before, setDefaultTimeout, defineParameterType}) {

    defineParameterType({
        regexp:      /\d+(?:st|nd|rd|th)/,
        transformer: function (string) {
            return parseInt(string.replace(/st|nd|rd|th/, ''));
        },
        typeName:    'ordinal'
    });

    setDefaultTimeout(20 * 1000);

    After(function () {

        browser.clearMockModules();

        return browser.executeScript(function () {
            if (window.localStorageSupport) {
                window.localStorage.clear();
            }
        });
    });

    Before(function () {

        const world = this;

        if (world.browserName) {
            return;
        }

        return browser
            .getCapabilities()
            .then(function (capabilities) {
                browser.browserName = world.browserName = capabilities.get('browserName');
            });
    });

    Before(function () {

        return browser.addMockModule('app', function () {

            window.addToHomescreen = angular.noop;

            angular.module('app').run(function ($rootScope) {
                window.configLocation = './fixtures/config/default.json';

                $rootScope.$on('$stateChangeSuccess', function () {
                    window.$stateIsResolved = true;
                });
            });

            MockFirebase.override();
        });
    });

    Before(function () {

        return browser.addMockModule('ngMockModule', function () {

            angular.module('ngMockModule', ['ngMockE2E']).run(function ($httpBackend) {

                let mockFeeds = ['lrYLc95e', 'WXu7kuaW', 'Q352cyuc', 'oR7ahO0J'];

                // mock each feed request defined in mockFeeds
                angular.forEach(mockFeeds, function (id) {

                    $httpBackend.whenGET('https://content.jwplatform.com/v2/playlists/' + id)
                        .respond(function () {
                            var request = new XMLHttpRequest();

                            request.open('GET', './fixtures/feed/' + id + '.json', false);
                            request.send(null);

                            return [request.status, request.response, {}];
                        });
                });

                // let all other requests pass
                $httpBackend.whenGET(/\S+/)
                    .passThrough();
            });
        });
    });

    Before(function () {

        return browser.addMockModule('disableAnimate', function () {

            angular.module('disableAnimate', []).run(function ($animate) {
                var style       = document.createElement('style');
                style.type      = 'text/css';
                style.innerHTML = '* {' +
                    '-webkit-transition: none !important;' +
                    '-moz-transition: none !important;' +
                    '-o-transition: none !important;' +
                    '-ms-transition: none !important;' +
                    'transition: none !important;' +
                    '}';
                document.getElementsByTagName('head')[0].appendChild(style);

                $animate.enabled(false);
            });
        });
    });
});
