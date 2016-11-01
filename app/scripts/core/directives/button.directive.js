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
        .directive('jwButton', jwButton);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwButton
     */

    jwButton.$inject = [];
    function jwButton () {
        return {
            link:       link,
            restrict:   'E',
            priority:   300,
            template:   '<a class="jw-button" ng-transclude></a>',
            replace:    true,
            transclude: true
        };

        function link (scope, element) {

            element.on('mousedown', function (event) {

                var effectElement = angular.element('<span class="jw-button-effect"></span>');

                angular.element(document.body).append(effectElement);

                effectElement.css({
                    top:  event.pageY + 'px',
                    left: event.pageX + 'px'
                });

                effectElement.addClass('active');

                setTimeout(function () {
                    effectElement.remove();
                }, 310);
            });

            // element.append('<span class="jw-button-effect"></span>');
        }
    }

}());
