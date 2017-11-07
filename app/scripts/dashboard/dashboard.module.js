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
     * @name jwShowcase.dashboard
     *
     * @description
     * Dashboard module
     */
    angular
        .module('jwShowcase.dashboard', [])
        .config(config);

    config.$inject = ['$stateProvider', 'seoProvider'];
    function config ($stateProvider, seoProvider) {

        $stateProvider
            .state('root.dashboard', {
                url:         '/',
                controller:  'DashboardController as vm',
                templateUrl: 'views/dashboard/dashboard.html',
                scrollTop:   'last',
                persistent:  true
            });

        seoProvider
            .state('root.dashboard', ['$state', 'config', function ($state, config) {
                return {
                    title:       config.siteName,
                    description: config.description,
                    canonical:   $state.href('root.dashboard', {}, {absolute: true})
                };
            }]);
    }

}());
