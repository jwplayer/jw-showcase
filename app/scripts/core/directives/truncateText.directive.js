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
        .directive('jwTruncateText', truncateTextDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwTruncateText
     *
     * @description
     * Truncate overflowing text and append ellipsis.
     *
     * @example
     *
     * ```
     * <div style="height: 100px; width: 100px;" jw-truncate-text="item.longDescription">
     * ```
     *
     * @requires app.core.utils
     */

    truncateTextDirective.$inject = ['utils'];
    function truncateTextDirective (utils) {

        return {
            link:     link,
            restrict: 'A',
            scope:    {
                jwTruncateText: '='
            }
        };

        function link (scope, element) {

            var suffix                = '...',
                elementWidth          = 0,
                elementHeight         = 0,
                truncateTextDebounced = utils.debounce(truncateText, 350);

            activate();

            ///////////

            /**
             * Initialize directive
             */
            function activate () {

                window.addEventListener('resize', resize);
                scope.$on('$destroy', destroy);

                resize();
            }

            /**
             * Handle $destroy event
             */
            function destroy () {

                window.removeEventListener('resize', resize);
            }

            /**
             * Handle browser resize event
             */
            function resize () {

                element.text(scope.jwTruncateText);

                elementWidth  = element[0].offsetWidth;
                elementHeight = element[0].offsetHeight;

                truncateTextDebounced();
            }

            /**
             * Truncate the text until it stops overflowing the element.
             */
            function truncateText () {

                var tries          = 0,
                    scrollHeight   = element[0].scrollHeight,
                    lastWordLength = 0,
                    preLength      = Math.ceil(scope.jwTruncateText.length * (elementHeight / scrollHeight)),
                    text           = scope.jwTruncateText.substr(0, preLength);

                if (scrollHeight <= elementHeight) {
                    return;
                }

                while (scrollHeight > elementHeight || lastWordLength < 3) {

                    text           = text.substr(0, text.lastIndexOf(' '));
                    lastWordLength = (text.length - text.lastIndexOf(' ')) - 1;

                    text += suffix;

                    // this is performance unfriendly. Set and get will force two reflows. By calculating the
                    // 'prelength' we can limit the amount of reflows.
                    element[0].textContent = text;
                    scrollHeight           = element[0].scrollHeight;

                    // limit tries
                    if (tries > 100) {
                        break;
                    }

                    tries++;
                }
            }
        }
    }

})();

