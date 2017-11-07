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
     * @name jwShowcase.video
     *
     * @description
     * Video module
     */
    angular
        .module('jwShowcase.video', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'seoProvider'];

    function config ($stateProvider, $urlRouterProvider, seoProvider) {

        $urlRouterProvider
            .when('/list/:feedId/video', '/p/:feedId')
            .when('/search/:query/video/:mediaId/:slug', '/m/:mediaId/:slug')
            .when('/list/:list/video/:mediaId/:slug', '/m/:mediaId/:slug?list');

        $stateProvider
            .state('root.video', {
                url:         '/m/:mediaId/:slug?list',
                controller:  'VideoController as vm',
                templateUrl: 'views/video/video.html',
                resolve:     {
                    item: resolveItem,
                    feed: resolveFeed
                },
                params:      {
                    autoStart: false,
                    startTime: null,
                    slug:      {
                        value:  null,
                        squash: true
                    }
                },
                scrollTop:   0
            });

        seoProvider
            .state('root.video', ['$state', 'config', 'item', 'utils', function ($state, config, item, utils) {
                var canonical = $state.href('root.video', {slug: utils.slugify(item.title)}, {absolute: true});

                return {
                    title:       item.title,
                    description: item.description,
                    image:       item.image,
                    canonical:   canonical,
                    schema:      {
                        '@context':   'http://schema.org/',
                        '@type':      'VideoObject',
                        '@id':        canonical,
                        name:         item.title,
                        description:  item.description,
                        duration:     utils.secondsToISO8601(item.duration, true),
                        thumbnailUrl: item.image,
                        uploadDate:   utils.secondsToISO8601(item.pubdate)
                    }
                };
            }]);

        /////////////////

        resolveItem.$inject = ['$stateParams', '$q', 'dataStore', 'api', 'config', 'preload'];

        function resolveItem ($stateParams, $q, dataStore, api, config) {

            var item = dataStore.getItem($stateParams.mediaId);

            // item not found in preloaded data.
            if (!item) {

                // show video not found error
                if (config.options.showcaseContentOnly) {
                    return $q.reject(new Error('Video not found'));
                }

                // get item from api.
                return api.getItem($stateParams.mediaId);
            }

            return item;
        }

        resolveFeed.$inject = ['$stateParams', 'dataStore', 'apiConsumer', 'config', 'preload'];

        function resolveFeed ($stateParams, dataStore, apiConsumer, config) {

            // publisher prefers using recommendations feed for the playlist
            var preferRecommendations = config.recommendationsPlaylist && config.options.useRecommendationPlaylist;

            // try feed from list query parameter first
            if ($stateParams.list && !preferRecommendations) {
                var feed = dataStore.getFeed($stateParams.list);

                if (feed) {
                    return feed.$promise;
                }
            }

            // try recommendations feed when recommendationsPlaylist is set
            if (config.recommendationsPlaylist) {

                return apiConsumer
                    .getRecommendationsFeed($stateParams.mediaId)
                    .catch(angular.noop); // prevent stateChangeError
            }
        }
    }

}());
