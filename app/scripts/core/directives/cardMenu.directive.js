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
        .directive('jwCardMenu', cardMenuDirective);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwCardMenu
     * @module jwShowcase.core
     *
     * @scope
     *
     * @param {jwShowcase.core.item}   item     Playlist item.
     * @param {function}               onClose  Callback which is called after the user clicks on the close button.
     *
     * @example
     *
     * ```
     * <jw-card-menu item="item" on-close="onClose()"></jw-card-menu>
     * ```
     */
    cardMenuDirective.$inject = [];
    function cardMenuDirective () {

        return {
            scope:            {
                item:    '='
            },
            require:          '^jwCard',
            controllerAs:     'vm',
            controller:       'CardMenuController',
            bindToController: true,
            replace:          true,
            templateUrl:      'views/core/cardMenu.html',
            link:             link
        };

        function link (scope, element, attr, jwCard) {

            scope.vm.jwCard = jwCard;

            activate();

            ////////

            /**
             * Initialize directive
             */
            function activate () {

                angular.element(document.body).on('click', onClickOutside);
                scope.$on('$destroy', onDestroy);
            }

            /**
             * Handle directive's $destroy event
             */
            function onDestroy () {

                angular.element(document.body).off('click', onClickOutside);
            }

            /**
             * Handle click event outside cardMenu
             * @param {Event} evt
             */
            function onClickOutside (evt) {

                var node = evt.target;

                while (node) {
                    if (node === element[0]) {
                        return;
                    }
                    node = node.parentNode;
                }

                scope.$apply(function () {
                    jwCard.closeMenu(false);
                });

                evt.preventDefault();
            }
        }
    }

}());
