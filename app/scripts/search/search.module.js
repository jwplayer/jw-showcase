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

    angular
        .module('jwShowcase.search', [])
        .config(config);

    /**
     * @ngdoc overview
     * @name jwShowcase.search
     *
     * @description
     * Search module
     */
    config.$inject = ['$stateProvider', 'seoProvider'];
    function config ($stateProvider, seoProvider) {

        $stateProvider
            .state('root.search', {
                url:         '/q/:query?{showCaptionMatches:boolean}',
                controller:  'SearchController as vm',
                templateUrl: 'views/search/search.html',
                scrollTop:   'last',
                persistent:  true,
                history:     false,
                params: {
                    showCaptionMatches: {
                        value:  false,
                        squash: true
                    }
                },
                resolve:     {
                    searchFeed: ['$q', 'config', '$stateParams', 'apiConsumer', 'preload',
                        function ($q, config, $stateParams, apiConsumer) {

                            var query = $stateParams.query.replace(/\+/g, ' ');

                            if (!config.searchPlaylist) {
                                return $q.reject('searchPlaylist is not defined');
                            }

                            return apiConsumer.getSearchFeed(query, $stateParams.showCaptionMatches);
                        }]
                }
            });

        seoProvider
            .state('root.search', ['$state', '$stateParams', 'config', function ($state, $stateParams, config) {

                var query = $stateParams.query.replace(/\+/g, ' ');

                return {
                    title:       query + ' - ' + config.siteName,
                    description: config.description,
                    canonical:   $state.href('root.search', {}, {absolute: true})
                };
            }]);
    }
}());
