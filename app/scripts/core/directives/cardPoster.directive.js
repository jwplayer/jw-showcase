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
        .directive('jwCardPoster', cardPosterDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCardPoster
     *
     * @description
     * # jwCardPoster
     * The `jwCardPoster` directive is used to load and fade-in a video poster.
     *
     * @scope
     *
     * @param {string=} src Full URL to image
     *
     * @example
     *
     * ```
     * <jw-card-poster src="item.poster"></jw-card-poster>
     * ```
     */

    cardPosterDirective.$inject = [];
    function cardPosterDirective () {

        return {
            replace:  true,
            scope:    {
                src: '='
            },
            template: '<div class="jw-card-poster"></div>',
            link:     link
        };

        function link (scope, element) {

            activate();

            ////////////////////////

            /**
             * Activate directive
             */
            function activate () {

                element.css({
                    backgroundImage:    'url(' + scope.src + ')',
                    backgroundPosition: 'center',
                    backgroundRepeat:   'no-repeat',
                    backgroundSize:     'cover'
                });
            }
        }
    }

}());
