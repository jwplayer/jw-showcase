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
        .service('player', player);

    /**
     * @ngdoc service
     * @name jwShowcase.core.player
     *
     * @description
     * This service is used to enable interaction to a Jwplayer instance. The playerDelegate can be set, but is
     * automatically set by the {@link jwShowcase.core.directive:jwPlayer `jwPlayerDirective`}.
     */

    player.$inject = [];
    function player () {

        var playerInstance,
            self = this;

        this.play              = playerMethod('play');
        this.pause             = playerMethod('pause');
        this.stop              = playerMethod('stop');
        this.seek              = playerMethod('seek');
        this.getState          = playerMethod('getState');
        this.playlistItem      = playerMethod('playlistItem');
        this.setCurrentQuality = playerMethod('setCurrentQuality');
        this.load              = playerMethod('load');
        this.setPlayer         = setPlayer;
        this.getPlayer         = getPlayer;

        this.currentTime = 0;

        ////////////////

        /**
         * Creates a function which calls the given method on the player delegate
         *
         * @param {string} method
         * @returns {Function}
         */
        function playerMethod (method) {

            return function () {
                if (playerInstance && angular.isFunction(playerInstance[method])) {
                    return playerInstance[method].apply(playerInstance, Array.prototype.slice.call(arguments));
                }
            };
        }

        /**
         * (Un)set player instance
         *
         * @param player
         */
        function setPlayer (player) {

            playerInstance = player;
        }

        /**
         * Get player instance
         * @returns {*}
         */
        function getPlayer () {

            return playerInstance;
        }
    }

}());
