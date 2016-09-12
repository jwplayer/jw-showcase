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
        .directive('jwCardMenu', cardMenuDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCardMenu
     *
     * @scope
     *
     * @param {app.core.item}   item            Playlist item
     * @param {function}        onClose         Callback which is called after the user clicks on the close button
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
                onClose: '&',
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
        }
    }

}());
