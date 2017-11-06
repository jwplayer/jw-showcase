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
        .module('jwShowcase.error', [])
        .config(config);

    config.$inject = ['$stateProvider'];
    function config ($stateProvider) {

        $stateProvider
            .state('error', {
                templateUrl: 'views/error/error.html',
                controller:  'ErrorController as vm',
                params:      {
                    message: ''
                }
            })
            .state('root.videoNotFound', {
                url:         '/e/video-not-found',
                templateUrl: 'views/error/videoNotFound.html'
            })
            .state('root.feedNotFound', {
                url:         '/e/feed-not-found',
                templateUrl: 'views/error/feedNotFound.html'
            });
    }

}());
