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

    MenuController.$inject = ['$scope', '$ionicPopup', 'menu', 'dataStore', 'watchlist', 'watchProgress', 'userSettings'];
    function MenuController ($scope, $ionicPopup, menu, dataStore, watchlist, watchProgress, userSettings) {

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

            confirmAction(
                'Are you sure you want to delete your current watch list?',
                function () {
                    watchlist
                        .clearAll();
                });
        }

        /**
         * Clear watch progress
         */
        function clearWatchProgress () {

            confirmAction(
                'Are you sure you want to delete your current watch progress?',
                function () {
                    watchProgress
                        .clearAll();
                });
        }

        /**
         * Show confirm dialog with cancel and yes button
         *
         * @param {string}   message    Message to show to user
         * @param {function} callback   Callback which gets called after the user tapped the yes button
         */
        function confirmAction (message, callback) {

            $ionicPopup.show({
                title:    'Confirm action',
                subTitle: message,
                scope:    $scope,
                buttons:  [{
                    text: 'Cancel'
                }, {
                    text:  '<b>Yes</b>',
                    type:  'button-positive',
                    onTap: function () {
                        callback();
                    }
                }]
            });
        }
    }

})();

