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
        .service('menu', MenuService);

    /**
     * @ngdoc service
     * @name app.core.menu
     */
    MenuService.$inject = ['$rootScope', '$timeout', '$controller', '$templateCache', '$ionicPopover'];
    function MenuService ($rootScope, $timeout, $controller, $templateCache, $ionicPopover) {

        var menuPopover;

        activate();

        return {
            toggle: toggle,
            hide:   hide,
            show:   show
        };

        //////////

        function activate () {

            // hide menu when state changes
            $rootScope.$on('$stateChangeStart', function () {
                if (menuPopover) {
                    hide();
                }
            });
        }

        /**
         * Position popover element
         * @param target
         * @param popoverElement
         */
        function positionView (target, popoverElement) {

            popoverElement.css({
                margin: 0,
                top:    0,
                left:   0
            });
        }

        /**
         * Toggle menu popover
         */
        function toggle () {

            if (menuPopover) {
                hide();
            }
            else {
                show();
            }
        }

        /**
         * Hide menu popover
         */
        function hide () {

            if (!menuPopover) {
                return;
            }

            menuPopover.hide();
        }

        /**
         * Show menu popover
         */
        function show () {

            var menuScope;

            if (menuPopover) {
                return;
            }

            menuScope = $rootScope.$new();

            // bind controller to menuScope and inject menu with hide method
            $controller('MenuController as vm', {
                $scope: menuScope,
                menu:   {
                    hide: hide
                }
            });

            // load menu popover
            menuPopover = $ionicPopover
                .fromTemplate($templateCache.get('views/core/menu.html'), {
                    scope:        menuScope,
                    positionView: positionView,
                    animation:    'menu-animation',
                    hideDelay:    300
                });

            menuScope.$on('popover.hidden', function(event, popover) {

                $timeout(function () {
                    menuPopover.remove();
                    menuPopover = null;
                }, popover.hideDelay);
            });

            menuPopover
                .show(document.body);
        }
    }

}());
