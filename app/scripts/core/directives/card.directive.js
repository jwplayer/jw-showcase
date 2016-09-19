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
        .directive('jwCard', cardDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCard
     *
     * @description
     * # jwCard
     * The `jwCard` directive renders a playlist item. There are two possible styles available; 'default' or
     * 'featured'.
     *
     * @scope
     *
     * @param {app.core.item}   item            Playlist item
     * @param {boolean=}        featured        Featured flag
     * @param {boolean=}        showTitle       Show item title when true
     * @param {boolean=}        showDescription Show item description when true
     * @param {function=}       onClick         Will be called when an click event occurs on the card.
     *
     * @example
     *
     * ```
     * <jw-card item="item" featured="false" show-title="true"></jw-card>
     * ```
     */

    cardDirective.$inject = [];
    function cardDirective () {

        return {
            scope:            {
                item:            '=',
                featured:        '=',
                showTitle:       '=',
                showDescription: '=',
                watchProgress:   '=',
                onClick:         '='
            },
            controllerAs:     'vm',
            controller:       'CardController',
            bindToController: true,
            replace:          true,
            templateUrl:      'views/core/card.html'
        };
    }

}());
