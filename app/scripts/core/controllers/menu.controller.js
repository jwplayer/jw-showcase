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
        .module('app.core')
        .controller('MenuController', MenuController);

    /**
     * @ngdoc controller
     * @name app.core.controller:MenuController
     */

    MenuController.$inject = ['$scope', 'confirm', 'menu', 'dataStore', 'watchlist', 'watchProgress', 'userSettings'];
    function MenuController ($scope, confirm, menu, dataStore, watchlist, watchProgress, userSettings) {

        var vm = this;

        vm.feeds     = [];
        vm.menu      = menu;
        vm.dataStore = dataStore;

        vm.userSettings = angular.extend({}, userSettings.settings);

        vm.clearWatchlist     = clearWatchlist;
        vm.clearWatchProgress = clearWatchProgress;

        activate();

        ////////////////

        /**
         * Initialize controller
         */
        function activate () {

            vm.feeds = [];

            if (angular.isArray(dataStore.feeds)) {
                vm.feeds = dataStore.feeds.slice();
            }

            if (dataStore.featuredFeed) {
                vm.feeds.unshift(dataStore.featuredFeed);
            }

            vm.feeds = vm.feeds.sort(function (a, b) {
                return a.title > b.title;
            });

            $scope.$watch('vm.userSettings.hd', function (value) {
                userSettings.set('hd', value);
            }, true);

            $scope.$watch('vm.userSettings.watchProgress', function (value) {
                userSettings.set('watchProgress', value);
            }, true);
        }

        /**
         * Clear watch list
         */
        function clearWatchlist () {

            confirm
                .show('Are you sure you want to delete your current watch list?')
                .then(function () {

                    watchlist
                        .clearAll();
                });
        }

        /**
         * Clear watch progress
         */
        function clearWatchProgress () {

            confirm
                .show('Are you sure you want to delete your current watch progress?')
                .then(function () {

                    watchProgress
                        .clearAll();
                });
        }
    }

})();

