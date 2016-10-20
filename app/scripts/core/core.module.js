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

(function () {

    /**
     * @ngdoc overview
     * @name app.core
     *
     * @description
     * Application's core module
     */
    angular
        .module('app.core', [])
        .factory('$exceptionHandler', exceptionHandler)
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', 'seoProvider'];
    function config ($stateProvider, seoProvider) {

        $stateProvider
            .state('root', {
                abstract:    true,
                resolve:     {
                    preload: preloadApp
                }
            })
            .state('root.404', {
                url:         '/404',
                templateUrl: 'views/core/404.html'
            });

        seoProvider
            .otherwise(['config', function (config) {
                return {
                    title:       config.siteName,
                    description: config.description
                };
            }]);

        /**
         * Preload application data
         *
         * @param {$q} $q
         * @param {$exceptionHandler} $exceptionHandler
         * @param {app.core.config} config
         * @param {app.core.configResolver} configResolver
         * @param {app.core.api} api
         * @param {app.core.apiConsumer} apiConsumer
         * @param {app.core.watchlist} watchlist
         *
         * @returns {$q.promise}
         */
        preloadApp.$inject = ['$q', '$exceptionHandler', 'config', 'configResolver', 'api', 'apiConsumer', 'watchlist', 'watchProgress'];
        function preloadApp ($q, $exceptionHandler, config, configResolver, api, apiConsumer, watchlist, watchProgress) {

            var defer = $q.defer();

            configResolver
                .getConfig()
                .then(function (resolvedConfig) {

                    var promises = [];

                    // apply config
                    angular.forEach(resolvedConfig, function (value, key) {
                        config[key] = value;
                    });

                    if (angular.isString(config.backgroundColor) && '' !== config.backgroundColor) {
                        document.body.style.backgroundColor = config.backgroundColor;
                    }

                    promises.push(api.getPlayer(config.player));

                    if (config.featuredPlaylist) {
                        promises.push(apiConsumer.getFeaturedFeed());
                    }

                    if (config.playlists) {
                        promises.push(apiConsumer.getFeeds());
                    }

                    $q.all(promises).then(
                        handlePreloadSuccess,
                        handlePreloadError
                    );
                }, handlePreloadError);

            return defer.promise;

            //////////////////

            function handlePreloadSuccess () {
                watchlist.restore();
                watchProgress.restore();
                defer.resolve();
            }

            function handlePreloadError (error) {
                $exceptionHandler(error);
                defer.reject();
            }
        }
    }

    run.$inject = ['$rootScope', '$state'];
    function run ($rootScope, $state) {

        window.FastClick.attach(document.body);

        $rootScope.$on('$stateChangeError', function (event, toState) {

            event.preventDefault();

            if (toState.name === 'root.video') {
                $state.go('root.404');
            }
            else if (toState.name !== 'root.dashboard') {
                $state.go('root.dashboard');
            }
        });
    }

    exceptionHandler.$inject = ['dataStore'];
    function exceptionHandler (dataStore) {

        return function (exception) {
            dataStore.loading = false;
            dataStore.error   = exception;
        };
    }

}());
