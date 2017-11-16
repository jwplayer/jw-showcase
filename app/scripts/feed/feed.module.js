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
     * @name jwShowcase.feed
     *
     * @description
     * Feed module
     */
    angular
        .module('jwShowcase.feed', [])
        .config(config);

    config.$inject = ['$stateProvider', 'seoProvider'];
    function config ($stateProvider, seoProvider) {

        $stateProvider
            .state('root.feed', {
                url:         '/p/:feedId',
                controller:  'FeedController as vm',
                templateUrl: 'views/feed/feed.html',
                resolve:     {
                    feed: resolveFeed
                },
                scrollTop:   'last',
                persistent:   true
            });

        seoProvider
            .state('root.feed', ['$state', 'config', 'feed', function ($state, config, feed) {

                return {
                    title:       feed.title + ' - ' + config.siteName,
                    description: feed.description,
                    canonical:   $state.href('root.feed', {}, {absolute: true})
                };
            }]);

        ////////////

        resolveFeed.$inject = ['$stateParams', '$q', 'dataStore', 'preload'];
        function resolveFeed ($stateParams, $q, dataStore) {

            var feed = dataStore.getFeed($stateParams.feedId);

            // if the feed is loading wait for the promise to resolve.
            if (feed && feed.loading) {
                return feed.promise;
            }

            return feed || $q.reject();
        }
    }
}());
