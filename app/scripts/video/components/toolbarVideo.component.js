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

    /**
     * @ngdoc component
     * @name jwToolbarVideo
     * @module jwShowcase.video
     *
     * @description
     *
     * # jwToolbarVideo
     * Render video toolbar component.
     *
     * @example
     *
     * ```html
     * <jw-toolbar-video item="item"></jw-toolbar-video>
     * ```
     */
    angular
        .module('jwShowcase.video')
        .component('jwToolbarVideo', {
            templateUrl:  'views/video/toolbarVideo.html',
            controller:   ToolbarVideoController,
            controllerAs: 'vm',
            transclude:   true,
            bindings:     {
                'item': '='
            }
        });

    ToolbarVideoController.$inject = ['$scope', '$state', 'popup', 'watchlist', 'serviceWorker', 'platform', 'config'];

    function ToolbarVideoController ($scope, $state, popup, watchlist, serviceWorker, platform, config) {

        var vm = this;

        vm.config      = config;
        vm.inWatchlist = false;
        vm.screenSize  = platform.screenSize();

        vm.shareButtonClickHandler     = shareButtonClickHandler;
        vm.watchlistButtonClickHandler = watchlistButtonClickHandler;

        vm.$onInit = activate;

        //////////////

        /**
         * Initialize
         */
        function activate () {

            $scope.$watch(function () {
                return watchlist.hasItem(vm.item);
            }, function (val) {
                vm.inWatchlist = val;
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.video.ToolbarVideoController#shareButtonClickHandler
         * @methodOf jwShowcase.video.ToolbarVideoController
         *
         * @description
         * Handle click event on the share button.
         */
        function shareButtonClickHandler (event) {

            popup.show({
                controller:  'ShareController as vm',
                templateUrl: 'views/core/popups/share.html',
                resolve:     {
                    item: vm.item
                },
                target:      event.target
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.video.ToolbarVideoController#watchlistButtonClickHandler
         * @methodOf jwShowcase.video.ToolbarVideoController
         *
         * @description
         * Handle click event on the watchlist button.
         */
        function watchlistButtonClickHandler () {

            if (vm.inWatchlist) {
                return watchlist.removeItem(vm.item);
            }

            if (!serviceWorker.isSupported()) {
                return watchlist.addItem(vm.item);
            }

            popup
                .showConfirm(
                    'Media files can use significant storage space on your device. Are you sure you want to download'
                )
                .then(function (result) {
                    if (result) {
                        watchlist.addItem(vm.item);
                    }
                });
        }
    }

}());

