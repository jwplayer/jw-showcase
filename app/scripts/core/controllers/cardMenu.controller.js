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
        .module('jwShowcase.core')
        .controller('CardMenuController', CardMenuController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.CardMenuController
     *
     * @requires $scope
     * @requires $timeout
     * @requires jwShowcase.core.watchlist
     * @requires jwShowcase.core.watchProgress
     * @requires jwShowcase.core.serviceWorker
     */
    CardMenuController.$inject = ['$scope', '$timeout', 'watchlist', 'watchProgress', 'serviceWorker', 'popup'];

    function CardMenuController ($scope, $timeout, watchlist, watchProgress, serviceWorker, popup) {

        var vm = this;

        vm.inWatchlist     = false;
        vm.inWatchProgress = false;

        vm.closeButtonClickHandler  = closeButtonClickHandler;
        vm.saveButtonClickHandler   = saveButtonClickHandler;
        vm.unsaveButtonClickHandler = unsaveButtonClickHandler;
        vm.removeButtonClickHandler = removeButtonClickHandler;

        vm.$onInit = activate;

        ////////////////////////

        /**
         * Initialize controller
         */
        function activate () {

            vm.inWatchlist     = watchlist.hasItem(vm.item);
            vm.inWatchProgress = watchProgress.hasItem(vm.item) && angular.isNumber(vm.item.progress);

            $scope.$watch(function () {
                return watchlist.hasItem(vm.item);
            }, function (val, oldVal) {
                if (val !== oldVal) {
                    $timeout(function () {
                        vm.inWatchlist = val;
                    }, 200);
                }
            }, false);
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.CardMenuController#closeButtonClickHandler
         * @methodOf jwShowcase.core.CardMenuController
         *
         * @description
         * Handle click event on the close button.
         *
         * @param {$event} event Synthetic event object.
         */
        function closeButtonClickHandler () {

            vm.jwCard.closeMenu(true);
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.CardMenuController#saveButtonClickHandler
         * @methodOf jwShowcase.core.CardMenuController
         *
         * @description
         * Handle click event on the save button.
         *
         * @param {$event} event Synthetic event object.
         */
        function saveButtonClickHandler () {

            if (!serviceWorker.isSupported()) {

                vm.jwCard.showToast({
                    templateUrl: 'views/core/toasts/savedVideo.html',
                    duration:    1000
                }).then(function () {
                    watchlist.addItem(vm.item);
                });

                $timeout(function () {
                    vm.jwCard.closeMenu();
                }, 500);

                return;
            }

            popup
                .showConfirm(
                    'Media files can use significant storage space on your device. Are you sure you want to download'
                )
                .then(function (result) {

                    // user clicked cancel
                    if (!result) {
                        return;
                    }

                    var close = vm.jwCard.showToast({
                        templateUrl: 'views/core/toasts/downloadingVideo.html',
                        duration:    -1
                    });

                    watchlist.addItem(vm.item).then(function () {

                        close().then(function () {
                            vm.jwCard.showToast({
                                templateUrl: 'views/core/toasts/savedVideo.html',
                                duration:    1000
                            });
                        });

                        $timeout(function () {
                            vm.jwCard.closeMenu();
                        }, 500);
                    });
                });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.CardMenuController#unsaveButtonClickHandler
         * @methodOf jwShowcase.core.CardMenuController
         *
         * @description
         * Handle click event on the unsave button.
         *
         * @param {$event} event Synthetic event object.
         */
        function unsaveButtonClickHandler () {

            vm.jwCard.showToast({
                templateUrl: 'views/core/toasts/unsavedVideo.html',
                duration:    1200
            }).then(null, null, function () {
                vm.jwCard.closeMenu();
                watchlist.removeItem(vm.item);
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.CardMenuController#removeButtonClickHandler
         * @methodOf jwShowcase.core.CardMenuController
         *
         * @description
         * Handle click event on the remove button.
         *
         * @param {$event} event Synthetic event object.
         */
        function removeButtonClickHandler () {

            vm.jwCard.showToast({
                templateUrl: 'views/core/toasts/removedVideo.html',
                duration:    1000
            }).then(null, null, function () {
                watchProgress.removeItem(vm.item);
                vm.jwCard.closeMenu();
            });
        }
    }

}());
