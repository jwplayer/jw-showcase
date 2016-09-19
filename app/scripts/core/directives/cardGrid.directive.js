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
    'use strict';

    angular
        .module('app.core')
        .directive('jwCardGrid', jwCardGrid);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCardGrid
     *
     * @description
     *
     * # jwCardGrid
     *
     * The `jwCardGrid` can be used to create a grid of cards. Each item will be rendered in the
     * {@link app.core.directive:jwCard `jwCard`} directive.
     *
     * @scope
     *
     * @param {app.core.feed}       feed            Feed with playlist to render jwCards.
     * @param {boolean|string=}     header          Text which will be displayed in the title or false if no title
     *                                              should be displayed.
     * @param {number=}             spacing         Spacing between cards.
     * @param {Object|number=}      cols            How many columns should be visible. Can either be a fixed number or
     *                                              an object with responsive columns (e.g. `{sm: 2, md: 4}`).
     *                                              Available sizes; xs, sm, md, lg and xl.
     *
     * @requires $timeout
     * @requires app.core.utils
     *
     * @example
     *
     * ```
     * <jw-card-grid feed="vm.feed" spacing="12" cols="{xs: 1, sm: 3}" heading="vm.feed.title"></jw-card-grid>
     * ```
     */

    jwCardGrid.$inject = ['$timeout', 'utils'];
    function jwCardGrid ($timeout, utils) {

        return {
            bindToController: true,
            controller:       angular.noop,
            controllerAs:     'vm',
            link:             link,
            templateUrl:      'views/core/cardGrid.html',
            replace:          true,
            scope:            {
                cols:        '=',
                spacing:     '=',
                heading:     '=',
                feed:        '=',
                onCardClick: '='
            }
        };

        function link (scope, element) {

            var cols            = 1,
                width           = 100,
                debouncedResize = utils.debounce(resize, 200);

            activate();

            ////////////////////////

            /**
             * Initialize the directive
             */
            function activate () {

                window.addEventListener('resize', debouncedResize);
                $timeout(resize, 50);

                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', debouncedResize);
                });
            }

            /**
             * Handle window resize event
             */
            function resize () {

                var toCols = scope.vm.cols;

                if (angular.isObject(toCols)) {
                    toCols = utils.getValueForScreenSize(toCols, 1);
                }

                if (cols === toCols) {
                    return;
                }

                cols  = toCols;
                width = 100 / cols;

                updateGrid();
            }

            /**
             * Update grid
             */
            function updateGrid () {

                var correction = scope.vm.spacing - (scope.vm.spacing / cols);

                angular.forEach(element[0].querySelectorAll('.jw-card'), function (card, index) {
                    card.style.width        = 'calc(' + width + '% - ' + correction + 'px)';
                    card.style.marginRight  = '';
                    card.style.marginBottom = scope.vm.spacing + 'px';

                    if ((index + 1) % cols) {
                        card.style.marginRight = scope.vm.spacing + 'px';
                    }
                });
            }
        }
    }
})();
