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
        .service('share', ShareService);

    ShareService.$inject = ['$rootScope', '$controller', '$templateCache', '$ionicPopover'];
    function ShareService ($rootScope, $controller, $templateCache, $ionicPopover) {

        var sharePopover  = null,
            shareTemplate = $templateCache.get('views/core/share.html');

        this.show = show;
        this.hide = hide;

        ////////////////

        /**
         * Show share popover
         *
         * @param {Object}          options
         * @param {Element}         options.target  Target element
         * @param {app.core.item}   options.item    Item to share
         */
        function show (options) {

            var shareScope;

            if (!options.target || !options.item) {
                return;
            }

            if (sharePopover) {
                return;
            }

            shareScope = $rootScope.$new();

            // bind controller to menuScope and inject menu with hide method
            $controller('ShareController as vm', {
                $scope:          shareScope,
                item:            options.item,
                popoverInstance: {
                    hide: hide
                }
            });

            // load share popover
            sharePopover = $ionicPopover
                .fromTemplate(shareTemplate, {
                    scope:    shareScope,
                    backdrop: false
                });

            shareScope.$on('popover.hidden', function () {
                sharePopover.remove();
                sharePopover = null;
            });

            sharePopover
                .show(options.target);
        }

        /**
         * Hide share popover
         */
        function hide () {

            if (!sharePopover) {
                return;
            }

            sharePopover.hide();
        }
    }

}());