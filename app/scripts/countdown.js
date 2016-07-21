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

    /**
     * Countdown plugin for jwplayer. If the player will auto advance it shows a message with the countdown.
     *
     * @param {Object} player           JW Player instance
     * @param {Object} options          Plugin options
     * @param {String} options.message  Message what will be shown in indicator. ${offset} will be replaced by the time
     *                                  remaining in seconds.
     * @param {Number} options.offset   Offset (from end) in seconds when the indicator will be shown.
     *
     * @param {Element} element
     */
    function countdown (player, options, element) {

        var _              = window.jwplayer._,
            playlistIndex  = 0,
            playlistLength = 1;

        options = _.extend({
            enabled: false,
            offset:  5,
            message: 'The next video will start in ${offset} seconds.'
        }, options);

        element.className += ' jw-countdown';
        element.style.display = 'none';

        if (false === options.enabled) {
            return;
        }

        player.on('ready', readyEventHandler);
        player.on('playlistItem', playlistItemEventHandler);
        player.on('time', timeEventHandler);
        player.on('complete', completeEventHandler);

        /**
         * Called when the player is ready
         */
        function readyEventHandler () {

            playlistLength = player.getPlaylist().length;
        }

        /**
         * Called when a new playlist item is loaded
         * @param {Object} event
         */
        function playlistItemEventHandler (event) {

            playlistIndex = event.index;
        }

        /**
         * Called on each time event
         * @param {Object} event
         */
        function timeEventHandler (event) {

            var remainingTime = Math.round(event.duration - event.position),
                showCountdown = remainingTime <= options.offset,
                toDisplay     = showCountdown ? 'block' : 'none';

            if (showCountdown) {
                element.textContent = options.message.replace('${offset}', remainingTime.toString());
            }

            if (toDisplay !== element.style.display) {
                element.style.display = toDisplay;
            }
        }

        /**
         * Called on complete event
         */
        function completeEventHandler () {

            element.style.display = 'none';
        }
    }

    jwplayer().registerPlugin('countdown', '6.0', countdown);

}());