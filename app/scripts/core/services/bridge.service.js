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

(function () {

    angular
        .module('jwShowcase.core')
        .factory('bridge', bridgeService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.bridge
     *
     * @required jwShowcase.core.bridge
     */
    bridgeService.$inject = ['$rootScope', '$timeout', '$state', '$stateParams', 'dataStore', 'history', 'userSettings',
        'sidebar', 'watchlist', 'watchProgress', 'utils', 'config'];

    function bridgeService ($rootScope, $timeout, $state, $stateParams, dataStore, history, userSettings, sidebar,
                            watchlist, watchProgress, utils, config) {

        var jwShowcase = window.jwShowcase;

        jwShowcase.config        = getConfig;
        jwShowcase.feeds         = getFeeds;
        jwShowcase.search        = search;
        jwShowcase.sidebar       = getServiceMethods(sidebar);
        jwShowcase.watchlist     = getServiceMethods(watchlist);
        jwShowcase.watchProgress = getServiceMethods(watchProgress);

        jwShowcase.settings = {
            get: getSetting,
            set: setSetting
        };

        jwShowcase.state = {
            go:     $state.go,
            is:     $state.is,
            goBack: goBack,
            get:    getState
        };

        $rootScope.$on('$stateChangeSuccess', function () {
            jwShowcase.dispatch('stateChanged', getState());
        });

        $rootScope.$watchCollection(function () {
            return userSettings.settings;
        }, function (settings) {
            jwShowcase.dispatch('settingsChanged', settings);
        });

        return {
            initialize: initialize
        };

        /////////////

        /**
         * Initialize bridge
         */
        function initialize () {
            jwShowcase.dispatch('ready');
        }

        /**
         * Shortcut to $state.go('search')
         * @param {string} phrase
         */
        function search (phrase) {
            $state.go('root.search', {
                query: utils.slugify(phrase, '+')
            });
        }

        /**
         * Go back to the previous state
         */
        function goBack () {
            history.goBack();
        }

        /**
         * Get the current state and params
         * @returns {Object}
         */
        function getState () {
            return {params: $stateParams, name: $state.current.name};
        }

        /**
         * Get all feeds. Including watchlist and watchProgress.
         * @returns {Array.<Object>}
         */
        function getFeeds () {
            return angular.copy(dataStore.feeds);
        }

        /**
         * Get setting(s)
         * @param {string} [key]
         * @returns {mixed}
         */
        function getSetting (key) {
            if (key) {
                return userSettings.settings[key];
            }

            return angular.copy(userSettings.settings);
        }

        /**
         * Set setting
         * @param {string} key
         * @param {mixed} value
         */
        function setSetting (key, value) {
            userSettings.set(key, value);
        }

        /**
         * Get config
         * @returns {Object}
         */
        function getConfig () {
            return angular.copy(config);
        }

        /**
         * Patch functions of the given service
         * @param service
         * @returns {Object}
         */
        function getServiceMethods (service) {

            var functions = {};

            angular.forEach(service, function (val, key) {
                if (angular.isFunction(val)) {
                    functions[key] = function () {
                        var args = arguments;
                        $timeout(function () {
                            service[key].apply(service, args);
                        });
                    };
                }
            });

            return functions;
        }
    }

}());
