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
        .controller('CardMenuController', CardMenuController);

    /**
     * @ngdoc controller
     * @name app.core.controller:CardMenuController
     */
    CardMenuController.$inject = ['watchlist'];
    function CardMenuController (watchlist) {

        var vm = this;

        vm.inWatchlist = false;

        vm.closeClickHandler           = closeClickHandler;
        vm.watchlistAddClickHandler    = watchlistAddClickHandler;
        vm.watchlistRemoveClickHandler = watchlistRemoveClickHandler;

        activate();

        ////////////////////////

        /**
         * Initialize controller
         */
        function activate () {

            update();
        }

        /**
         * Update controller
         */
        function update () {

            vm.inWatchlist = watchlist.hasItem(vm.item);
        }

        /**
         * Handle click event on close button
         */
        function closeClickHandler () {

            if (angular.isFunction(vm.onClose)) {
                vm.onClose();
            }
        }

        /**
         * Handle click event on add to watchlist button
         */
        function watchlistAddClickHandler () {

            watchlist.addItem(vm.item);
            update();
        }

        /**
         * Handle click event on remove from watchlist button
         */
        function watchlistRemoveClickHandler () {

            watchlist.removeItem(vm.item);
            update();
        }
    }

})();
