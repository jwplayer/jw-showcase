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
     * @requires $location
     * @requires app.core.dataStore
     * @requires app.core.utils
     */
    VideoController.$inject = ['$state', '$stateParams', '$location', 'dataStore', 'utils', 'feed', 'item'];
    function VideoController ($state, $stateParams, $location, dataStore, utils, feed, item) {

        var vm = this;

        vm.item              = item;
        vm.feed              = feed;
        vm.moreLikeThisFeed  = {};
        vm.duration          = 0;
        vm.isPlaying         = false;
        vm.facebookShareLink = '';
        vm.twitterShareLink  = '';

        vm.onPlaylistItemEvent = onPlaylistItemEvent;
        vm.onCardClickHandler  = onCardClickHandler;


        activate();

        ////////////////////////

        /**
         * Initialize the controller.
         */
        function activate () {

            vm.playerSettings = {
                width:       '100%',
                height:      '100%',
                aspectratio: '16:9',
                ph:          4,
                autostart:   $stateParams.autoStart,
                playlist:    [generatePlaylistItem(vm.item)],
                sharing:     false
            };

            update();
        }

        /**
         * Update controller
         */
        function update () {

            vm.facebookShareLink = composeFacebookLink();
            vm.twitterShareLink  = composeTwitterLink();

            vm.duration = utils.getVideoDurationByItem(vm.item);

            vm.moreLikeThisFeed = {
                playlist: vm.feed.playlist.filter(function (item) {
                    return item.mediaid !== vm.item.mediaid;
                })
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
         * Handle playlist item event
         * @param {Object} event
         */
        function onPlaylistItemEvent (event) {

            if (!event.item || event.item.mediaid === vm.item.mediaid) {
                return;
            }

            var mediaId = event.item.mediaid,
                feedId  = feed.feedid,
                newItem = dataStore.getItem(mediaId, feedId);

            // item does not exist in current feed. Update title and description but not the url
            if (!newItem) {
                vm.item = event.item;
                update();
                return;
            }

            // update state, but don't notify
            $state.go('root.video', {
                feedId:  newItem.feedid,
                mediaId: newItem.mediaid
            }, {
                notify: false
            });

            vm.item = newItem;
            update();
        }

        /**
         * Compose a Facebook share link with the current URL
         *
         * @returns {string}
         */
        function composeFacebookLink () {

            var facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?p[url]={url}';

            return facebookShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()));
        }

        /**
         * Compose a Twitter share link with the current URL and title
         *
         * @returns {string}
         */
        function composeTwitterLink () {

            var twitterShareLink = 'http://twitter.com/share?text={text}&amp;url={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()))
                .replace('{text}', encodeURIComponent(item.title));
        }
    }

}());