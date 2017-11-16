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
    'use strict';

    angular
        .module('jwShowcase.dashboard')
        .directive('jwContentRow', jwContentRow);

    jwContentRow.$inject = ['$compile', '$templateCache'];

    function jwContentRow ($compile, $templateCache) {
        return {
            link:     link,
            restrict: 'E',
            replace:  true,
            template: '<div class="jw-content-row"></div>',
            scope:    {
                feed:             '=',
                options:          '=',
                cardClickHandler: '='
            }
        };

        function link (scope, element, attrs) {

            var template = $templateCache.get('views/dashboard/rows/' + scope.options.type + '.html');
            var html     = $compile(template)(scope);

            element.addClass('jw-content-row-' + scope.options.type);

            if (scope.options.playlistId) {
                element.addClass('jw-content-row-' + scope.options.playlistId);
            }

            element.append(html);

            if (scope.options.backgroundColor) {
                element.css('background-color', scope.options.backgroundColor);
            }
        }
    }

})();

