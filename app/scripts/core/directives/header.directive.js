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
     * @name jwHeader
     * @module app.core
     * @restrict E
     *
     * @description
     *
     * # jwHeader
     * Render the header element.
     *
     * @example
     *
     * ```html
     * <jw-header></jw-header>
     * ```
     *
     * @param {object=} [state-class] Toggle class based current state name
     */

    headerDirective.$inject = [];
    function headerDirective () {

        return {
            restrict:         'E',
            scope:            {
                stateClass: '='
            },
            controllerAs:     'vm',
            controller:       'HeaderController',
            bindToController: true,
            replace:          true,
            transclude:       {
                left:  '?jwHeaderLeft',
                main:  'jwHeaderMain',
                right: '?jwHeaderRight'
            },
            templateUrl:      'views/core/header.html',
            link:             link
        };

        function link (scope, element) {

            scope.$on('$stateChangeSuccess', function (evt, toState) {

                var stateClass = scope.vm.stateClass;

                if (angular.isObject(stateClass)) {

                    Object
                        .keys(stateClass)
                        .forEach(function (className) {
                            element.toggleClass(className, stateClass[className] === toState.name);
                        });
                }
            });
        }
    }

}());
