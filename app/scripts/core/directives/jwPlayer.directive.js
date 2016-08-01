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
     * @requires $timeout
     * @requires app.core.utils
     * @requires config
     *
     * @example
     *
     * ```
     * <jw-player settings="vm.playerSettings" on-play="vm.onPlayEvent"></jw-player>
     * ```
     *
     */
    JwPlayerDirective.$inject = ['$parse', '$timeout', 'utils', 'config'];
    function JwPlayerDirective ($parse, $timeout, utils, config) {

        return {
            scope:       {
                settings: '='
            },
            replace:     true,
            templateUrl: 'views/core/jwPlayer.html',
            link:        link
        };

        function link (scope, element, attr) {

            var events         = ['ready', 'play', 'pause', 'complete', 'seek', 'error'],
                playerInstance = null,
                relatedPlugin  = null,
                playerId       = generateRandomId();

            activate();

            ////////////////////////

            /**
             * Initialize directive
             */
            function activate () {

                angular
                    .element(element[0])
                    .attr('id', playerId);

                playerInstance = jwplayer(playerId)
                    .setup(angular.extend({}, scope.settings));

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
                    .on('ready', function () {

                        relatedPlugin = playerInstance.getPlugin('related');

                        if (relatedPlugin) {
                            relatedPlugin.on('play', function (event) {
                                proxyEvent('relatedPlay', event);
                            });
                        }

                    });

                // custom events from directive
                events.forEach(function (event) {

                    playerInstance
                        .on(event, function (event) {
                            proxyEvent(type, event);
                        });
                });
            }

            /**
             * Proxy JW Player event to directive attribute
             *
             * @param {string} type
             * @param {Object} event
             */
            function proxyEvent (type, event) {

                var attrName = 'on' + utils.ucfirst(type),
                    parsed;

                parsed = $parse(attr[attrName])(scope.$parent);

                if (angular.isFunction(parsed)) {
                    scope.$apply(function () {
                        parsed(event);
                    });
                }
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
