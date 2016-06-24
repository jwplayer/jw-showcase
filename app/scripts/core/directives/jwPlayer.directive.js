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
        .directive('jwPlayer', JwPlayerDirective);

    /**
     * @ngdoc directive
     * @name app.video.directive:jwPlayer
     *
     * @description
     * This directive is used to create an Jwplayer instance.
     *
     * @param {Object=} settings Jwplayer settings that will be used in the `.setup()` method.
     *
     * @requires $parse
     * @requires app.core.utils
     *
     * @example
     *
     * ```
     * <jw-player settings="vm.playerSettings" on-play="vm.onPlayEvent"></jw-player>
     * ```
     *
     */
    JwPlayerDirective.$inject = ['$parse', '$timeout', 'utils'];
    function JwPlayerDirective ($parse, $timeout, utils) {

        return {
            scope:       {
                settings: '='
            },
            replace:     true,
            transclude:  true,
            templateUrl: 'views/core/jwPlayer.html',
            link:        link
        };

        function link (scope, element, attr) {

            var events         = ['ready', 'play', 'pause', 'complete', 'seek', 'error'],
                playerInstance = null,
                playerId       = generateRandomId();

            activate();

            ////////////////////////

            /**
             * Initialize directive
             */
            function activate () {

                angular
                    .element(element[0].querySelector('.jw-player-ref'))
                    .attr('id', playerId);

                playerInstance = jwplayer(playerId)
                    .setup(scope.settings);

                if (scope.settings.width) {
                    element.css('width', scope.settings.width);
                }

                scope.$on('$destroy', function () {
                    $timeout(function () {
                        playerInstance.remove();
                    }, 1000);
                });

                bindPlayerEventListeners();

            }

            /**
             * Add event listeners to playerInstance
             */
            function bindPlayerEventListeners () {

                playerInstance
                    .on('play pause idle', handlePlayerEvent);

                // custom events from directive
                events.forEach(function (event) {

                    var parsed,
                        attrName = 'on' + utils.ucfirst(event);

                    if (!attr[attrName]) {
                        return;
                    }

                    parsed = $parse(attr[attrName])(scope.$parent);

                    if (angular.isFunction(parsed)) {

                        playerInstance
                            .on(event, wrapEventCallback(parsed));
                    }
                });
            }

            /**
             * Handle player event
             * @param event
             */
            function handlePlayerEvent (event) {

                element
                    .removeClass('is-play is-pause is-idle')
                    .addClass('is-' + event.type);
            }

            /**
             * Wrap player event callback to request a $digest
             * @param {Function} callback
             * @returns {Function}
             */
            function wrapEventCallback (callback) {

                return function (event) {

                    scope.$apply(function () {
                        callback(event);
                    });
                };
            }

            /**
             * Generate random player id
             * @returns {*}
             */
            function generateRandomId () {

                var randomNumber = Math.round(Math.random() * 10000),
                    candidateId  = 'player-' + randomNumber;

                if (!document.querySelector('#' + candidateId)) {
                    return candidateId;
                }

                return generateRandomId();
            }
        }
    }

}());
