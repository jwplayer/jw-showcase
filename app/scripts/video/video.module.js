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
     * @name app.video
     *
     * @description
     * Video module
     */
    angular
        .module('app.video', [])
        .config(config);

    config.$inject = ['$stateProvider', 'seoProvider'];
    function config ($stateProvider, seoProvider) {

        $stateProvider
            .state('root.video', {
                url:     '/video/:feedId/:mediaId',
                views:   {
                    '@': {
                        controller:  'VideoController as vm',
                        templateUrl: 'views/video/video.html'
                    }
                },
                resolve: {
                    item: resolveItem,
                    feed: resolveFeed
                },
                params:  {
                    autoStart: false
                },
                cache:   false
            });

        seoProvider
            .state('root.video', ['$stateParams', 'config', 'dataStore', function ($stateParams, config, dataStore) {

                var item = dataStore.getItem($stateParams.mediaId, $stateParams.feedId);

                return {
                    title:       config.siteName + ' | ' + item.title,
                    description: item.description,
                    image:       item.image
                };
            }]);

        /////////////////

        resolveItem.$inject = ['$stateParams', '$q', 'dataStore', 'preload'];
        function resolveItem ($stateParams, $q, dataStore) {
            return dataStore.getItem($stateParams.mediaId, $stateParams.feedId) || $q.reject();
        }

        resolveFeed.$inject = ['$stateParams', '$q', 'dataStore', 'preload'];
        function resolveFeed ($stateParams, $q, dataStore) {
            return dataStore.getFeed($stateParams.feedId) || $q.reject();
        }
    }

}());
