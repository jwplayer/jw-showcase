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
        .directive('jwHeaderMenuButton', headerMenuButtonDirective);

    /**
     * @ngdoc directive
     * @name jwHeaderMenuButton
     * @module app.core
     * @restrict E
     *
     * @requires app.core.menu
     *
     * @param {string=} [icon=jwy-icon-menu] Icon
     */

    headerMenuButtonDirective.$inject = ['menu'];
    function headerMenuButtonDirective (menu) {

        return {
            restrict:         'E',
            require:          '^jwHeader',
            scope:            {
                icon: '@'
            },
            template:         '<div class="jw-button jw-button-menu" ng-click="vm.menuButtonClickHandler()"><i class="jwy-icon {{ vm.icon || \'jwy-icon-menu\' }}"></i></div>',
            replace:          true,
            controller:       angular.noop,
            controllerAs:     'vm',
            bindToController: true,
            transclude:       true,
            link:             link
        };

        function link (scope) {

            scope.vm.menuButtonClickHandler = menuButtonClickHandler;

            /**
             * Handle click on menu button
             */
            function menuButtonClickHandler () {

                menu.toggle();
            }
        }
    }

}());
