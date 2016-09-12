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
        .directive('jwHeader', headerDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwHeader
     *
     * @description
     * # jwHeader
     * Render the header element.
     *
     * @param {boolean}     backButton  Show the back button
     * @param {string=}     heading     Show heading instead of the logo
     *
     * @example
     *
     * ```
     * <jw-header></jw-header>
     * <jw-header back-button="true" heading="'Title'"></jw-header>
     * ```
     */

    headerDirective.$inject = [];
    function headerDirective () {

        return {
            scope:            {
                backButton: '=',
                heading:    '='
            },
            controllerAs:     'vm',
            controller:       'HeaderController',
            bindToController: true,
            replace:          true,
            templateUrl:      'views/core/header.html'
        };
    }

}());
