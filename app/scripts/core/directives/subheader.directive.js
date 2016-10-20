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
        .directive('jwSubheader', subheaderDirective);

    /**
     * @ngdoc directive
     * @name jwSubheader
     * @module app.core
     * @restrict E
     *
     * @description
     *
     * # jwSubheader
     * Render the subheader element.
     *
     * @example
     *
     * ```html
     * <jw-subheader heading="'My title'" back-button="true"></jw-subheader>
     * ```
     *
     * @param {string=} [heading]       Title to display in the center
     * @param {bool=}   [back-button]   Toggle back button
     */

    subheaderDirective.$inject = [];
    function subheaderDirective () {

        return {
            restrict:         'E',
            scope:            {
                heading:    '=',
                backButton: '='
            },
            controllerAs:     'vm',
            controller:       'SubheaderController',
            bindToController: true,
            replace:          true,
            templateUrl:      'views/core/subheader.html'
        };
    }

}());
