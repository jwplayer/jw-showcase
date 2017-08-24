
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

/* jshint esversion: 6 */
/* globals require, browser, angular */

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

        });
    });

    Before(function () {

        return browser.addMockModule('ngMockModule', function () {

            angular.module('ngMockModule', ['ngMockE2E']).run(function ($httpBackend) {

                let mockFeeds = ['lrYLc95e', 'WXu7kuaW', 'Q352cyuc', 'oR7ahO0J'];

                function returnFixture (id) {
                    return function () {
                        var request = new XMLHttpRequest();

                        request.open('GET', './fixtures/feed/' + id + '.json', false);
                        request.send(null);

                        return [request.status, request.response, {}];
                    };
                }

                // mock each feed request defined in mockFeeds
                angular.forEach(mockFeeds, function (id) {

                    $httpBackend.whenGET('https://content.jwplatform.com/v2/playlists/' + id)
                        .respond(returnFixture(id));
                });

                // search playlist
                $httpBackend.whenGET('https://content.jwplatform.com/v2/playlists/r3MhKJyA?search=trailer')
                    .respond(returnFixture('searchFeed'));

                // empty search playlist
                $httpBackend.whenGET('https://content.jwplatform.com/v2/playlists/r3MhKJyA?search=nothing')
                    .respond(returnFixture('emptySearchFeed'));

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

    Before(function () {
        const world = this;

        // Make sure this is ran only once.
        if(!world.user) {
            world.user = null;
        }

        return browser.addMockModule('firebase', function () {

            angular.module('firebase').factory('$firebaseObject', function () {
                return function () {
                    return {
                        $loaded: function () {
                            return Promise.resolve({});
                        }
                    };
                };
            });

            angular.module('firebase').factory('$firebaseArray', function () {
                return function () {
                    return {
                        $loaded: function () {
                            return Promise.resolve({});
                        }
                    };
                };
            });

             angular.module('firebase').factory('$firebaseAuth', function () {

                 window.firebase = {
                     initializeApp: function () {
                         return Promise.resolve();
                     },
                     database: function () {
                        return {
                            ref: function () {
                                return Promise.resolve();
                            }
                        };
                     }
                 };

                    return function () {
                        return {
                            $waitForSignIn: function () {
                                return Promise.resolve();
                            },
                            $getAuth: function () {
                                return null;
                            },
                            $onAuthStateChanged: function () {

                            },
                            $createUserWithEmailAndPassword: function () {
                                return Promise.resolve({
                                    sendEmailVerification: function () {
                                        return Promise.resolve();
                                    }
                                });
                            },
                            $signInWithEmailAndPassword: function () {
                                return Promise.resolve({
                                    emailVerified: true
                                });
                            },
                            $signOut: function () {

                                return Promise.resolve();
                            }
                        };
                    };
                }
            );
        });

    });

    Before("@mock-user-logged-in", function () {

        return browser.addMockModule('app', function () {
            angular.module('firebase').factory('$firebaseAuth', function () {
                return function () {
                    return {
                        $waitForSignIn: function () {
                            return Promise.resolve();
                        },
                        $getAuth: function () {
                            return {
                                displayName: 'John Doe',
                                email: 'johndoe@test.com'
                            };
                        },
                        $onAuthStateChanged: function () {

                        },
                        $createUserWithEmailAndPassword: function () {
                            return Promise.resolve({
                                sendEmailVerification: function () {
                                    return Promise.resolve();
                                }
                            });
                        },
                        $signInWithEmailAndPassword: function () {

                            return Promise.resolve({
                                emailVerified: true
                            });
                        },
                        $signOut: function () {

                            return Promise.resolve();
                        }
                    };
                };
            });
        });
    });

    Before("@mock-user-create-error", function () {

        return browser.addMockModule('app', function () {
            angular.module('firebase').factory('$firebaseAuth', function () {
                return function () {
                    return {
                        $waitForSignIn: function () {
                            return Promise.resolve();
                        },

                        $getAuth: function () {
                            return null;
                        },
                        $onAuthStateChanged: function () {

                        },
                        $createUserWithEmailAndPassword: function (email, password) {
                            return Promise.resolve({
                                sendEmailVerification: function () {
                                    return Promise.resolve();
                                }
                            });
                        },
                        $signInWithEmailAndPassword: function (email, password) {
                            return Promise.reject(new Error());
                        },
                        $signOut: function () {

                            return Promise.resolve();
                        }
                    };
                };
            });
        });
    });
});
