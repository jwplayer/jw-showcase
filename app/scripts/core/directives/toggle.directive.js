/**
 * Copyright 2017 Longtail Ad Solutions Inc.
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

    var TOGGLE_SWIPE_THRESHOLD = 15;

    angular
        .module('jwShowcase.core')
        .directive('jwToggle', jwToggle);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwToggle
     */

    jwToggle.$inject = ['$swipe'];
    function jwToggle ($swipe) {

        return {
            link:        link,
            restrict:    'E',
            scope:       true,
            templateUrl: 'views/core/toggle.html',
            require:     'ngModel'
        };

        function link (scope, element, attrs, ctrl) {

            var toggle      = angular.element(element[0].querySelector('.jw-toggle')),
                startCoords = null;

            activate();

            ////////////////////////

            /**
             * Initialize directive
             */
            function activate () {

                ctrl.$render = function () {
                    toggle.attr('aria-pressed', ctrl.$viewValue);
                    toggle.toggleClass('jw-toggle-flag-checked', ctrl.$viewValue);
                };

                ctrl.$parsers.push(function (val) {
                    return !!val;
                });

                $swipe.bind(toggle, {
                    start:  swipeStartHandler,
                    cancel: swipeCancelHandler,
                    move:   swipeMoveHandler,
                    end:    swipeEndHandler
                });

                element.on('keyup', function (evt) {
                    if (13 === evt.which) {
                        ctrl.$setViewValue(!ctrl.$viewValue);
                        ctrl.$render();
                    }
                });

                scope.$on('$destroy', destroyHandler);
            }

            /**
             * Handle swipe start event
             * @param {Object} coords
             * @param {Object} event
             */
            function swipeStartHandler (coords, event) {

                startCoords = coords;

                event.preventDefault();
                event.stopImmediatePropagation();
            }

            /**
             * Handle swipe cancel event
             */
            function swipeCancelHandler () {

                startCoords = null;
            }

            /**
             * Handle swipe move event
             * @param {Object} coords
             */
            function swipeMoveHandler (coords) {

                if (startCoords && Math.abs(startCoords.x - coords.x) > TOGGLE_SWIPE_THRESHOLD) {
                    swipeEndHandler(coords);
                    startCoords = null;
                }
            }

            /**
             * Handle swipe end event
             * @param {Object} coords
             */
            function swipeEndHandler (coords) {

                var toValue;

                if (startCoords) {
                    if (startCoords.x < coords.x) {
                        toValue = true;
                    }
                    else if (startCoords.x > coords.x) {
                        toValue = false;
                    }
                    else {
                        toValue = !ctrl.$viewValue;
                    }

                    toggle.attr('aria-pressed', toValue);
                    toggle.toggleClass('jw-toggle-flag-checked', toValue);
                    ctrl.$setViewValue(toValue);
                }
            }

            /**
             * Handle directive's destroy event
             */
            function destroyHandler () {

                toggle.off();
            }
        }
    }

}());
