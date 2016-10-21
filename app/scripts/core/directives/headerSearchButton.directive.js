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
        .directive('jwHeaderSearchButton', headerSearchButtonDirective);

    /**
     * @ngdoc directive
     * @name jwHeaderSearchButton
     * @module app.core
     * @restrict E
     */

    headerSearchButtonDirective.$inject = [];
    function headerSearchButtonDirective () {

        return {
            restrict:   'E',
            require:    '^jwHeader',
            template:   '<div class="jw-button jw-button-search" ng-click="vm.searchButtonClickHandler()"><i class="jwy-icon jwy-icon-search"></i></div>',
            replace:    true,
            transclude: true,
            link:       link
        };

        function link (scope) {

            function searchButtonClickHandler () {
                console.log('clicked search button');
            }

            scope.vm = {
                searchButtonClickHandler: searchButtonClickHandler
            };
        }
    }

}());
