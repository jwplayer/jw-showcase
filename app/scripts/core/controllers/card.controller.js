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
        .controller('CardController', CardController);

    /**
     * @ngdoc controller
     * @name app.core.controller:CardController
     * @requires $rootScope
     * @requires $scope
     * @requires app.core.utils
     */
    CardController.$inject = ['$rootScope', '$scope', 'utils', 'watchlist', '$timeout'];
    function CardController ($rootScope, $scope, utils, watchlist, $timeout) {

        var vm = this;

        vm.duration               = 0;
        vm.getClassNames          = getClassNames;
        vm.clickHandler           = clickHandler;
        vm.menuButtonClickHandler = menuButtonClickHandler;
        vm.closeMenuHandler       = closeMenuHandler;
        vm.menuVisible            = false;
        vm.inWatchList            = false;
        vm.toast                  = null;

        vm.watchlistClickHandler = watchlistClickHandler;
        vm.showToast             = showToast;

        activate();

        ////////////////

        /**
         * Initialize controller
         */
        function activate () {

            vm.duration    = utils.getVideoDurationByItem(vm.item);
            vm.inWatchList = watchlist.hasItem(vm.item);

            $scope.$on('jwCardMenu:open', handleCardMenuOpenEvent);

            $scope.$watch(function () {
                return watchlist.hasItem(vm.item);
            }, function (val, oldVal) {
                if (val !== oldVal) {
                    vm.inWatchList = val;
                }
            });
        }

        /**
         * Handle watchlistclick event
         */
        function watchlistClickHandler () {

            if (watchlist.hasItem(vm.item) === true) {
                watchlist.removeItem(vm.item);
                // vm.inWatchList = false;
                vm.showToast({template: 'removedFromWatchlist', duration: 1000});
            }
        }

        /**
         * Show a toast over the card
         *
         * @param {Object} toast                Toast options object
         * @param {String} toast.template       Template name
         * @param {Number} [toast.duration]     Optional duration
         */
        function showToast (toast) {

            vm.toast = toast;

            $timeout(function () {
                vm.toast = null;
            }, toast.duration || 1000);
        }

        /**
         * Handle jwCardMenu:open event
         * @param {$event} event
         * @param {$scope} targetScope
         */
        function handleCardMenuOpenEvent (event, targetScope) {

            if (targetScope === $scope) {
                return;
            }

            vm.menuVisible = false;
            vm.toast       = null;
        }

        /**
         * @returns {Object.<string, boolean>}
         */
        function getClassNames () {

            return {
                'jw-card--featured': vm.featured,
                'jw-card--default':  !vm.featured,
                'jw-card--touch':    'ontouchstart' in window ||
                                     (window.DocumentTouch && document instanceof window.DocumentTouch),
                'jw-card-menu-open': vm.menuVisible
            };
        }

        /**
         * @param {Object}      event               Event object
         * @param {boolean}     clickedOnPlayIcon   True if the user clicked on the play icon
         */
        function clickHandler (event, clickedOnPlayIcon) {

            if (angular.isFunction(vm.onClick)) {
                vm.onClick(vm.item, clickedOnPlayIcon);
            }

            event.preventDefault();
            event.stopImmediatePropagation();
        }

        /**
         * Handle click on more button
         * @param event
         */
        function menuButtonClickHandler (event) {

            event.stopImmediatePropagation();
            vm.menuVisible = true;

            $rootScope.$broadcast('jwCardMenu:open', $scope);
        }

        /**
         * Close menu
         */
        function closeMenuHandler () {

            vm.menuVisible = false;
        }
    }

}());
