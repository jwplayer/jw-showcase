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
        .controller('HeaderController', HeaderController);

    /**
     * @ngdoc controller
     * @name app.core.controller:HeaderController
     *
     * @requires $state
     * @requires $window
     * @requires config
     */
    HeaderController.$inject = ['$state', '$window', 'config'];
    function HeaderController ($state, $window, config) {

        var vm = this;

        vm.config = config;

        vm.getHeaderClassNames    = getHeaderClassNames;
        vm.backButtonClickHandler = backButtonClickHandler;

        ////////////////

        function getHeaderClassNames () {

            return {
                'jw-header':      true,
                'jw-header--alt': !!vm.heading
            };
        }

        /**
         * Handle click event on back button
         */
        function backButtonClickHandler () {

            if ($state.history.length > 1) {
                $window.history.back();
            }
            else {
                $state.go('root.dashboard');
            }
        }
    }

}());