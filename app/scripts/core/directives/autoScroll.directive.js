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
        .directive('jwAutoScroll', autoScrollDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwAutoScroll
     *
     * @description
     * # jwAutoScroll
     * The `jwAutoScroll` directive automatically scrolls the element to the last position when registered in the
     * {@link app.core.autoScrollProvider `autoScrollProvider`}.
     *
     * @example
     *
     * ```
     * <ui-view jw-auto-scroll></ui-view>
     * ```
     */

    autoScrollDirective.$inject = ['$rootScope', '$timeout', '$state', 'autoScroll'];
    function autoScrollDirective ($rootScope, $timeout, $state, autoScroll) {

        return {
            scope: false,
            link:  link
        };

        function link (scope, element) {

            var states = autoScroll.states;

            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
            scope.$on('$viewContentLoaded', onViewContentLoaded);

            /**
             * Handle $stateChangeSuccess event
             *
             * @param event
             * @param toState
             * @param toParams
             * @param fromState
             */
            function onStateChangeSuccess (event, toState, toParams, fromState) {

                var fromStateOpts = states[fromState.name];

                // should save scrollTop
                if (fromStateOpts) {
                    fromStateOpts.scrollTop = element[0].scrollTop;
                }
            }

            /**
             * Handle $viewContentLoaded event
             */
            function onViewContentLoaded () {

                var toStateOpts = states[$state.current.name];

                if (!toStateOpts) {
                    return;
                }

                $timeout(function () {
                    element[0].scrollTop = toStateOpts.scrollTop;
                }, toStateOpts.delay);
            }
        }
    }

}());
