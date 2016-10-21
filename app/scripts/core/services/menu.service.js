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
    MenuService.$inject = ['$rootScope', '$controller', '$ionicPopover'];
    function MenuService ($rootScope, $controller, $ionicPopover) {

        var menuPopover,
            menuScope = $rootScope.$new();

        activate();

        return {
            toggle: toggle
        };

        //////////

        function activate () {

            // bind controller to menuScope
            $controller('MenuController as vm', {$scope: menuScope});

            // load menu popover
            $ionicPopover
                .fromTemplateUrl('/views/core/menu.html', {
                    scope:        menuScope,
                    positionView: positionView
                })
                .then(function (popover) {
                    menuPopover = popover;
                });

            // hide menu when state changes
            $rootScope.$on('$stateChangeStart', function () {
                if (menuPopover && menuPopover.isShown()) {
                    menuPopover.hide();
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
                opacity: 1,
                margin:  0,
                top:     0,
                left:    0
            });
        }

        /**
         * Toggle menu popover
         */
        function toggle () {

            if (!menuPopover) {
                return;
            }

            if (menuPopover.isShown()) {
                menuPopover.hide();
            }
            else {
                menuPopover.show(document.body);
            }
        }
    }

}());
