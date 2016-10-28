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
            link:     link,
            restrict: 'A'
        };

        function link (scope, element) {

            element.on('click', function (event) {

                var rect   = element[0].getBoundingClientRect(),
                    effect = angular.element(element[0].querySelector('.jw-button-effect'));

                effect.css({
                    top:  event.pageY - rect.top + 'px',
                    left: event.pageX - rect.left + 'px'
                });

                effect.addClass('active');

                setTimeout(function () {
                    effect.removeClass('active');
                }, 300);
            });

            element.append('<span class="jw-button-effect"></span>');
        }
    }

}());
