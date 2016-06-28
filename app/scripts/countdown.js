/**
 * @author      Christiaan Scheermeijer <christiaan@videodock.com>
 * @copyright   2016 Video Dock b.v.
 *
 * This file is part of the jabberwocky project.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
                showCountdown = remainingTime <= options.offset;

            element.textContent   = options.message.replace('${offset}', remainingTime.toString());
            element.style.display = showCountdown ? 'block' : 'none';
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