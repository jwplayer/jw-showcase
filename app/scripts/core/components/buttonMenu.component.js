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

    /**
     * @ngdoc component
     * @name jwButtonMenu
     * @module jwShowcase.core
     *
     * @requires jwShowcase.core.menu
     *
     * @param {string=} [icon=jwy-icon-menu] Icon
     */

    angular
        .module('jwShowcase.core')
        .component('jwButtonMenu', {
            bindings: {
                icon: '@'
            },
            controller:   ButtonMenuController,
            controllerAs: 'vm',
            templateUrl:  'views/core/buttonMenu.html'
        });

    /**
     * @ngdoc controller
     * @name jwShowcase.core.ButtonMenuController
     *
     * @requires jwShowcase.core.menu
     */
    ButtonMenuController.$inject = ['sidebar'];
    function ButtonMenuController (sidebar) {

        var vm = this;

        vm.menuButtonClickHandler = menuButtonClickHandler;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.ButtonMenuController#menuButtonClickHandler
         * @methodOf jwShowcase.core.ButtonMenuController
         *
         * @description
         * Handle click event on the menu button.
         */
        function menuButtonClickHandler () {

            sidebar.toggle();
        }
    }

}());
