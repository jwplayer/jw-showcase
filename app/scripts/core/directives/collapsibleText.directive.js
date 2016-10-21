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
        .directive('jwCollapsibleText', collapsibleTextDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCollapsibleText
     *
     * @requires app.core.utils
     */

    collapsibleTextDirective.$inject = ['utils'];
    function collapsibleTextDirective (utils) {

        return {
            scope:            {
                jwCollapsibleText: '@'
            },
            restrict:         'A',
            controller:       angular.noop,
            controllerAs:     'vm',
            templateUrl:      'views/core/collapsibleText.html',
            bindToController: true,
            transclude:       true,
            replace:          true,
            link:             link
        };

        function link (scope, element) {

            var resizeDebounced = utils.debounce(resize, 300),
                contentElement = angular.element(element[0].querySelector('.jw-collapsible-text-content'));

            scope.vm.toggleClickHandler = toggleClickHandler;

            activate();

            //////////////////

            function activate () {

                scope.vm.expanded = false;
                contentElement.css('maxHeight', scope.vm.jwCollapsibleText);

                window.addEventListener('resize', resizeDebounced);
                scope.$on('$destroy', destroy);

                resizeDebounced();
            }

            /**
             * Handle destroy event
             */
            function destroy () {

                window.removeEventListener('resize', resizeDebounced);
            }

            /**
             * Handle resize event
             */
            function resize () {

                if (!scope.vm.expanded) {
                    element.toggleClass('inactive', contentElement[0].scrollHeight <= contentElement[0].offsetHeight);
                }
                else {
                    contentElement.css('maxHeight', contentElement[0].scrollHeight + 'px');
                }
            }

            /**
             * Handle click event on toggle button
             */
            function toggleClickHandler () {

                scope.vm.expanded = !scope.vm.expanded;

                element.toggleClass('expanded', scope.vm.expanded);

                if (!scope.vm.expanded) {
                    contentElement.css('maxHeight', scope.vm.jwCollapsibleText);
                    resizeDebounced();
                    return;
                }

                contentElement.css('maxHeight', contentElement[0].scrollHeight + 'px');
            }
        }
    }

})();

