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
        .module('app.video')
        .controller('VideoController', VideoController);

    /**
     * @ngdoc controller
     * @name app.video.controller:VideoController
     *
     * @requires $state
     * @requires $stateParams
     * @requires $timeout
     * @requires app.core.dataStore
     * @requires app.core.utils
     */
    VideoController.$inject = ['$state', '$stateParams', '$timeout', 'config', 'utils', 'feed', 'item'];
    function VideoController ($state, $stateParams, $timeout, config, utils, feed, item) {

        var vm = this,
            nextItem,
            mouseMoveTimeout;

        vm.item              = item;
        vm.feed              = feed;
        vm.duration          = 0;
        vm.isPlaying         = false;
        vm.controlsVisible   = true;
        vm.facebookShareLink = composeFacebookLink();
        vm.twitterShareLink  = composeTwitterLink();

        vm.onReady    = onPlayerEvent;
        vm.onPlay     = onPlayerEvent;
        vm.onPause    = onPlayerEvent;
        vm.onComplete = onCompleteEvent;
        vm.onError    = onPlayerEvent;

        vm.onCardClickHandler = onCardClickHandler;
        vm.mouseMoveHandler   = mouseMoveHandler;

        activate();

        ////////////////////////

        /**
         * Initialize the controller.
         */
        function activate () {

            var itemIndex = feed.playlist.findIndex(function (item) {
                return item.mediaid === vm.item.mediaid;
            });

            nextItem = feed.playlist[itemIndex + 1];

            vm.duration = utils.getVideoDurationByItem(vm.item);

            vm.feed.playlist = vm.feed.playlist.filter(function (item) {
                return item.mediaid !== vm.item.mediaid;
            });

            vm.playerSettings = {
                width:       '100%',
                height:      '100%',
                aspectratio: '16:9',
                ph:          4,
                autostart:   $stateParams.autoStart,
                playlist:    [generatePlaylistItem(vm.item)],
                sharing:     false,
                countdown:   !!nextItem && config.autoAdvance
            };
        }

        /**
         * Generate playlist item from feed item
         *
         * @param {Object}      item    Item from feed
         *
         * @returns {Object} Playlist item
         */
        function generatePlaylistItem (item) {

            return {
                mediaid:     item.mediaid,
                title:       item.title,
                description: item.description,
                image:       item.image,
                sources:     item.sources,
                tracks:      item.tracks
            };
        }

        /**
         * Handle player event
         * @param event
         */
        function onPlayerEvent (event) {

            vm.isPlaying       = 'play' === event.type;
            vm.controlsVisible = !vm.isPlaying;
        }

        /**
         * Handle complete event
         * @param event
         */
        function onCompleteEvent (event) {

            if (!!nextItem && config.autoAdvance) {

                return $state.go('root.video', {
                    mediaId:   nextItem.mediaid,
                    feedId:    nextItem.feedid,
                    autoStart: true
                });
            }

            onPlayerEvent(event);
        }

        /**
         * Handle mouse move event
         */
        function mouseMoveHandler () {

            if (!vm.controlsVisible) {
                vm.controlsVisible = true;
            }

            $timeout.cancel(mouseMoveTimeout);
            mouseMoveTimeout = $timeout(function () {
                if (true === vm.isPlaying) {
                    vm.controlsVisible = false;
                }
            }, 4000);
        }

        /**
         * Handle click event on card
         *
         * @param {Object}      item        Clicked item
         * @param {boolean}     autoStart   Should the video playback start automatically
         */
        function onCardClickHandler (item, autoStart) {

            $state.go('root.video', {
                feedId:    item.feedid,
                mediaId:   item.mediaid,
                autoStart: autoStart
            });
        }

        /**
         * Compose a Facebook share link with the current URL
         *
         * @returns {string}
         */
        function composeFacebookLink () {

            var facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?p[url]={url}';

            return facebookShareLink
                .replace('{url}', encodeURIComponent(window.location.href));
        }

        /**
         * Compose a Twitter share link with the current URL and title
         *
         * @returns {string}
         */
        function composeTwitterLink () {

            var twitterShareLink = 'http://twitter.com/share?text={text}&amp;url={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent(window.location.href))
                .replace('{text}', encodeURIComponent(item.title));
        }
    }

}());