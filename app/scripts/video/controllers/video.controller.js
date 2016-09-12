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
     * @requires $window
     * @requires app.core.dataStore
     * @requires app.core.watchProgress
     * @requires app.core.watchList
     * @requires app.core.utils
     */
    VideoController.$inject = ['$state', '$stateParams', '$location', '$window', 'dataStore', 'watchProgress', 'watchlist', 'utils', 'feed', 'item'];
    function VideoController ($state, $stateParams, $location, $window, dataStore, watchProgress, watchlist, utils, feed, item) {

        var vm       = this,
            lastPos  = 0,
            progress = 0,
            watchProgressItem;

        vm.item              = item;
        vm.feed              = {};
        vm.duration          = 0;
        vm.feedTitle         = feed.feedid === 'watchlist' ? 'Watchlist' : 'More like this';
        vm.facebookShareLink = composeFacebookLink();
        vm.twitterShareLink  = composeTwitterLink();
        vm.inWatchList       = false;

        vm.onPlay         = onPlay;
        vm.onComplete     = onComplete;
        vm.onFirstFrame   = onFirstFrame;
        vm.onTime         = onTime;
        vm.onPlaylistItem = onPlaylistItem;

        vm.backButtonClickHandler = backButtonClickHandler;
        vm.cardClickHandler       = cardClickHandler;

        vm.addToWatchList      = addToWatchList;
        vm.removeFromWatchList = removeFromWatchList;

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

            vm.feed = {
                playlist: feed.playlist.filter(function (item) {
                    return item.mediaid !== vm.item.mediaid;
                })
            };

            watchProgressItem = watchProgress.getItem(vm.item);
            progress          = watchProgressItem ? watchProgressItem.progress : 0;

            vm.inWatchList = watchlist.hasItem(vm.item);
        }

        /**
         * Add current item to watchlist
         */
        function addToWatchList () {

            watchlist.addItem(vm.item);
            vm.inWatchList = true;
        }

        /**
         * Remove current item from watchlist
         */
        function removeFromWatchList () {

            watchlist.removeItem(vm.item);
            vm.inWatchList = false;
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
                image:       utils.replaceImageSize(item.image, 1920),
                sources:     item.sources,
                tracks:      item.tracks
            };
        }

        /**
         * Handle playlist item event
         * @param {Object} event
         */
        function onPlaylistItem (event) {

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
         * Handle play event
         * @param event
         */
        function onPlay (event) {

            if (progress > 0 && $stateParams.autoStart && event.type === 'play') {
                this.seek(progress * this.getDuration());
                progress = 0;
            }
        }

        /**
         * Handle firstFrame event
         * @param event
         */
        function onFirstFrame (event) {

            if (progress > 0 && !$stateParams.autoStart && event.type === 'firstFrame') {
                this.seek(progress * this.getDuration());
                progress = 0;
            }
        }

        /**
         * Handle complete event
         * @param event
         */
        function onComplete (event) {

            watchProgress.removeItem(vm.item);
        }

        /**
         * Handle time event
         * @param event
         */
        function onTime (event) {

            var position = Math.round(event.position),
                progress = event.position / event.duration;

            if (lastPos === position) {
                return;
            }

            lastPos = position;

            if (angular.isNumber(progress) && position % 2) {
                handleWatchProgress(progress);
            }
        }

        /**
         * Save or remove watchProgress
         * @param {number} progress
         */
        function handleWatchProgress (progress) {

            if (progress > watchProgress.WATCH_PROGRESS_MAX) {
                if (watchProgress.hasItem(vm.item)) {
                    watchProgress.removeItem(vm.item);
                }
            }
            else {
                watchProgress.saveItem(vm.item, progress);
            }
        }

        /**
         * Handle click event on card
         *
         * @param {Object}      item        Clicked item
         * @param {boolean}     autoStart   Should the video playback start automatically
         */
        function cardClickHandler (item, autoStart) {

            $state.go('root.video', {
                feedId:    item.feedid,
                mediaId:   item.mediaid,
                autoStart: autoStart
            });
        }

        /**
         * Handle click event on back button
         */
        function backButtonClickHandler () {

            if ($state.history.length > 1) {
                $window.history.back();
            }
            else {
                $state.go('root.dashboard');
            }
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