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
        .directive('jwButton', jwButton);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwButton
     * @module jwShowcase.core
     *
     * @description
     * Generic button directive which adds `jw-button` className and button effect.
     *
     * @requires jwShowcase.core.platform
     */
    jwButton.$inject = ['platform'];
    function jwButton (platform) {
        return {
            link:       link,
            restrict:   'E',
            priority:   300,
            template:   '<a class="jw-button" ng-transclude></a>',
            replace:    true,
            transclude: true
        };

        function link (scope, element, attr) {

            var tabindex,
                listener = platform.isTouch ? 'touchstart' : 'mousedown';

            activate();

            ////////////////

            /**
             * Initialize directive
             */
            function activate () {

                tabindex = element.attr('tabindex') || 0;

                element.on(listener, buttonDownHandler);
                scope.$on('$destroy', destroyHandler);

                if (attr.isDisabled) {
                    scope.$watch(attr.isDisabled, function (disabled) {
                        element.attr('tabindex', disabled ? -1 : tabindex);
                        element.toggleClass('jw-button-disabled', disabled);
                        element.attr('aria-disabled', disabled);
                    });
                }

            }

            /**
             * Handle down event on the button element
             * @param event
             */
            function buttonDownHandler (event) {

                var effectElement = angular.element('<span class="jw-button-effect"></span>'),
                    touch         = event.touches && event.touches.length && event.touches[0],
                    changedTouch  = event.changedTouches && event.changedTouches[0],
                    e             = touch || changedTouch || event;

                angular.element(document.body).append(effectElement);

                effectElement.css({
                    top:  e.pageY + 'px',
                    left: e.pageX + 'px'
                });

                effectElement.addClass('active');

                // use browsers setTimeout so this this is always executed.
                setTimeout(function () {
                    effectElement.remove();
                }, 310);
            }

            /**
             * Handle destroy event
             */
            function destroyHandler () {

                element.off();
            }
        }
    }

}());
