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
        .module('jwShowcase.core')
        .directive('jwCardGrid', jwCardGrid);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwCardGrid
     * @module jwShowcase.core
     *
     * @description
     *
     * # jwCardGrid
     *
     * The `jwCardGrid` can be used to create a grid of cards. Each item will be rendered in the
     * {@link jwShowcase.core.directive:jwCard `jwCard`} directive.
     *
     * @scope
     *
     * @param {jwShowcase.core.feed}    feed            Feed with playlist to render jwCards.
     * @param {boolean|string=}         header          Text which will be displayed in the title or false if no title
     *                                                  should be displayed.
     * @param {Object|number=}          cols            How many columns should be visible. Can either be a fixed number
     *                                                  or an object with responsive columns (e.g. `{sm: 2, md: 4}`).
     *                                                  Available sizes; xs, sm, md, lg and xl.
     *
     * @requires $timeout
     * @requires jwShowcase.core.utils
     *
     * @example
     *
     * ```
     * <jw-card-grid feed="vm.feed" cols="{xs: 1, sm: 3}" heading="vm.feed.title"></jw-card-grid>
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
                feed:           '=',
                aspectratio:    '=?',
                cols:           '=?',
                rows:           '=?',
                enableTitle:    '=?',
                enableText:     '=?',
                enablePreview:  '=?',
                enableShowMore: '=?',
                enableSeeAll:   '=?',
                onCardClick:    '=',
                cardClassName:  '@',
                title:          '@'
            }
        };

        function link (scope, element) {

            var columnOption    = {xs: 2, sm: 2, md: 3, lg: 4, xl: 5},
                currentCols     = 0,
                currentRows     = 6,
                debouncedResize = utils.debounce(resize, 200);

            activate();

            ////////////////////////

            /**
             * Initialize the directive
             */
            function activate () {

                // set initial rows
                if (scope.vm.rows) {
                    currentRows = scope.vm.rows;
                }

                if (scope.vm.cols) {
                    columnOption = scope.vm.cols;
                }

                scope.vm.controlIsVisible     = controlIsVisible;
                scope.vm.showMoreClickHandler = showMoreClickHandler;
                scope.vm.limit                = 9;
                scope.vm.heading              = scope.vm.title;

                if (!scope.vm.heading && scope.vm.feed) {
                    scope.vm.heading = scope.vm.feed.title;
                }

                window.addEventListener('resize', debouncedResize);
                resize();

                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', debouncedResize);
                });
            }

            /**
             * Handle window resize event
             */
            function resize () {

                var toColumns    = columnOption,
                    gridsElement = angular.element(element[0].querySelector('.jw-card-grid-cards'));

                if (angular.isObject(toColumns)) {
                    toColumns = utils.getValueForScreenSize(toColumns, 1);
                }

                if (currentCols === toColumns) {
                    return;
                }

                currentCols = toColumns;

                $timeout(function () {
                    scope.vm.limit = toColumns * currentRows;
                });

                gridsElement[0].className = 'jw-card-grid-cards jw-card-grid-' + currentCols;
            }

            /**
             * Returns true when control should be visible
             * @returns {boolean|string}
             */
            function controlIsVisible () {
                return scope.vm.feed.playlist.length > scope.vm.limit &&
                    (scope.vm.enableShowMore || scope.vm.enableSeeAll);
            }

            /**
             * Handle click on Show more button
             */
            function showMoreClickHandler () {

                currentRows += 10;
                scope.vm.limit = currentCols * currentRows;
            }
        }
    }

}());
