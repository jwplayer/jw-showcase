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
        .module('jwShowcase.video')
        .controller('VideoController', VideoController);

    /**
     * @ngdoc controller
     * @name jwShowcase.video.controller:VideoController
     *
     * @requires $scope
     * @requires $state
     * @requires $stateParams
     * @requires $timeout
     * @requires jwShowcase.core.dataStore
     * @requires jwShowcase.core.popup
     * @requires jwShowcase.core.watchProgress
     * @requires jwShowcase.core.watchlist
     * @requires jwShowcase.core.seo
     * @requires jwShowcase.core.userSettings
     * @requires jwShowcase.core.player
     * @requires jwShowcase.core.platform
     * @requires jwShowcase.core.serviceWorker
     * @requires jwShowcase.core.utils
     * @requires jwShowcase.config
     */
    VideoController.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'dataStore', 'popup', 'watchProgress',
        'seo', 'userSettings', 'player', 'platform', 'serviceWorker', 'utils', 'config', 'item', 'feed'];

    function VideoController ($scope, $state, $stateParams, $timeout, dataStore, popup, watchProgress, seo,
                              userSettings, player, platform, serviceWorker, utils, config, item, feed) {

        var vm                       = this,
            lastPos                  = 0,
            performedConditionalSeek = false,
            started                  = false,
            requestQualityChange     = false,
            startTime                = $stateParams.startTime,
            playlist                 = [],
            enableRelatedOverlay     = config.experimental.enableRelatedOverlay,
            levels,
            watchProgressItem,
            loadingTimeout;

        /**
         * Current playing item
         * @type {jwShowcase.core.item}
         */
        vm.item = item;

        /**
         * Config
         * @type {jwShowcase.config}
         */
        vm.config = config;

        /**
         * Loading flag
         * @type {boolean}
         */
        vm.loading = true;

        /**
         * Feed which is being used as playlist for the player.
         * @type {jwShowcase.core.feed}
         */
        vm.activeFeed = feed;

        /**
         * Title of feed
         * @type {string}
         */
        vm.activeFeedTitle = enableRelatedOverlay ? 'Related Videos' : 'Next Up';

        /**
         * Is true when the right rail is enabled.
         * @type {boolean}
         */
        vm.enableRail = config.options.rightRail.enabled;

        /**
         * Player settings
         * @type {Object}
         */
        vm.playerSettings = {
            width:          '100%',
            height:         '100%',
            aspectratio:    '16:9',
            ph:             4,
            autostart:      $state.params.autoStart,
            playlist:       [],
            preload:        'metadata',
            sharing:        false,
            visualplaylist: false,
            cast:           config.options.cast || {},
            analytics:      {
                bi: config.id
            }
        };
        vm.onComplete     = onComplete;
        vm.onFirstFrame   = onFirstFrame;
        vm.onTime         = onTime;
        vm.onPlaylistItem = onPlaylistItem;
        vm.onLevels       = onLevels;
        vm.onReady        = onReady;
        vm.onError        = onError;
        vm.onSetupError   = onSetupError;
        vm.onAdImpression = onAdImpression;

        vm.cardClickHandler = cardClickHandler;

        activate();

        ////////////////////////

        /**
         * Initialize controller.
         */
        function activate () {

            ensureItemIsInFeed();
            createPlayerSettings();

            $scope.$watch(function () {
                return userSettings.settings.conserveBandwidth;
            }, conserveBandwidthChangeHandler);

            $scope.$watch(function () {
                return serviceWorker.isOnline();
            }, connectionChangeHandler);

            loadingTimeout = $timeout(function () {
                vm.loading = false;
            }, 2000);

            update();
        }

        /**
         * Update controller
         */
        function update () {
            watchProgressItem = watchProgress.getItem(vm.item);
        }

        /**
         * Update the state silently. Meaning the $stateParams are updated with the new item, but the state isn't
         * reloaded. This prevents the page from reloading and reinitialising the player.
         */
        function updateStateSilently () {

            var newStateParams = {
                mediaId: vm.item.mediaid,
                slug:    utils.slugify(vm.item.title),
                list:    undefined
            };

            if (vm.item.feedid !== config.recommendationsPlaylist) {
                newStateParams.list = vm.item.feedid;
            }

            angular.merge($state.params, newStateParams);
            angular.merge($stateParams, newStateParams);

            $state.$current.locals.globals.item = vm.item;

            $state
                .go('root.video', newStateParams, {
                    notify: false
                })
                .then(function () {
                    // update the SEO metadata
                    seo.update();
                });
        }

        /**
         * Create player settings
         */
        function createPlayerSettings () {

            playlist = generatePlaylist(vm.activeFeed, item);

            vm.playerSettings.playlist = playlist;

            // disable advertising when we are offline, this prevents errors while playing videos offline in PWA.
            if (!navigator.onLine) {
                vm.playerSettings.advertising = false;
            }

            // if no skin is selected in dashboard use the jw-showcase skin
            if (!window.jwplayer.defaults.skin) {
                // if using JW8
                if (window.jwplayer.version.indexOf('8') === 0) {
                    vm.playerSettings.skin = { name: 'jw-showcase' };
                } else {
                    vm.playerSettings.skin = 'jw-showcase';
                }
            }

            if (!!window.cordova) {
                vm.playerSettings.analytics.sdkplatform = platform.isAndroid ? 1 : 2;
                vm.playerSettings.cast                  = false;
            }

            // disable related overlay if showcaseContentOnly is true.
            if (config.options.showcaseContentOnly) {
                vm.playerSettings.related = false;
            }

            // Show related after each video
            if (enableRelatedOverlay && $stateParams.list) {
                vm.playerSettings.related = {
                    file:       'https://cdn.jwplayer.com/v2/playlists/' + $stateParams.list,
                    oncomplete: 'show'
                };
            }

            // override player settings from config
            if (angular.isObject(config.options.player)) {
                angular.merge(vm.playerSettings, config.options.player);
            }
        }

        /**
         * Ensure that the item is in the feed
         */
        function ensureItemIsInFeed () {

            if (!vm.activeFeed) {
                return;
            }

            var itemIndex = vm.activeFeed.playlist.findIndex(byMediaId(vm.item.mediaid));

            if (itemIndex === -1) {
                vm.activeFeed.playlist.unshift(item);
            }
        }

        /**
         * Generate playlist from feed and current item
         *
         * @param {jwShowcase.core.feed}      feed    Feed
         * @param {jwShowcase.core.item}      item    Current item
         *
         * @returns {Object} Playlist item
         */
        function generatePlaylist (feed, item) {

            var playlist     = [item],
                isPwaOffline = serviceWorker.isSupported() && !serviceWorker.isOnline(),
                isAndroid4   = platform.isAndroid && platform.platformVersion < 5,
                itemIndex    = 0;

            if (feed) {
                playlist = angular.copy(feed.playlist);

                // find item index
                itemIndex = playlist.findIndex(byMediaId(item.mediaid));

                // re-order playlist to start with given item
                playlist = playlist
                    .slice(itemIndex)
                    .concat(playlist.slice(0, itemIndex));
            }

            // filter out items that not have been downloaded when PWA is offline
            if (isPwaOffline) {
                playlist = playlist.filter(function (item) {
                    return serviceWorker.isOnline() || serviceWorker.hasDownloadedItem(item);
                });
            }

            // make small corrections to item sources
            playlist.forEach(function (playlistItem) {

                playlistItem.sources = playlistItem.sources.filter(function (source) {
                    // filter out HLS streams for Android 4
                    if (isAndroid4 && 'application/vnd.apple.mpegurl' === source.type) {
                        return false;
                    }

                    // filter out non playable sources when PWA is offline
                    if (isPwaOffline) {
                        return source.type === 'video/mp4' && source.width <= 720;
                    }

                    return 'application/dash+xml' !== source.type;
                });

                // only use the first source when PWA is offline
                if (isPwaOffline) {
                    playlistItem.sources.splice(1);
                }
            });

            if (enableRelatedOverlay) {
                // Only load 1 video to enable related overlay
                playlist.splice(1);
            }

            return playlist;
        }

        /**
         * Handle conserveBandwidth setting change
         *
         * @param {boolean} value
         */
        function conserveBandwidthChangeHandler (value) {

            var levelsLength,
                toQuality = 0;

            // nothing to do
            if (!levels) {
                return;
            }

            levelsLength = levels.length;

            if (true === value) {
                toQuality = levelsLength > 2 ? levelsLength - 2 : levelsLength;
            }

            requestQualityChange = toQuality;
        }

        /**
         * Handle changes in connection
         * @param val
         * @param prevVal
         */
        function connectionChangeHandler (val, prevVal) {

            // don't reload playlist when nothing changed
            if (val === prevVal) {
                return;
            }

            var state = player.getState();

            // reload the playlist when connection has changed to ensure all playable items are loaded in the playlist.
            if (state !== 'playing' && state !== 'paused') {
                playlist = generatePlaylist(vm.activeFeed, vm.item);
                player.load(playlist);
                update();
            }
        }

        /**
         * Handle ready event
         *
         * @param {Object} event
         */
        function onReady (event) {

            // Disabled because it scrolls down to the player
            // if (config.options.enablePlayerAutoFocus && angular.isFunction(this.getContainer)) {
            //     this.getContainer().focus();
            // }

            if (!vm.playerSettings.autostart) {
                vm.loading = false;
                $timeout.cancel(loadingTimeout);
            }
        }

        /**
         * Handle error event
         *
         * @param {Object} event
         */
        function onError (event) {

            vm.loading = false;
            $timeout.cancel(loadingTimeout);
        }

        /**
         * Handle setup error event
         */
        function onSetupError () {

            popup
                .showConfirm('Something went wrong while loading the video, try again?')
                .then(function (result) {
                    if (true === result) {
                        $state.reload();
                    }
                });

            vm.loading = false;
            $timeout.cancel(loadingTimeout);
        }

        /**
         * Handle playlist item event
         *
         * @param {Object} event
         */
        function onPlaylistItem (event) {

            // search item in dataStore
            var newItem = dataStore.getItem(event.item.mediaid);

            // if item is not loaded in showcase
            if (!newItem) {

                // return when publisher has showcaseContentOnly set to true
                if (config.options.showcaseContentOnly) {
                    return;
                }

                // fallback to item given in event object
                newItem = event.item;
            }

            // return if item doesn't exist or its the same item
            if (newItem.mediaid === vm.item.mediaid) {
                return;
            }

            vm.item = newItem;

            updateStateSilently();
            update();
        }

        /**
         * Handle firstFrame event
         */
        function onFirstFrame () {

            // call update here too so that watchProgressItem can
            // be set before trying to resume watchProgress
            update();

            var levelsLength;

            if (vm.loading) {
                vm.loading = false;
            }

            if (!started && window.fbq) {
                window.fbq('track', 'Lead', {
                    value: 10.00,
                    currency: 'USD'
                });
            }

            started = true;

            if (!levels) {
                return;
            }

            levelsLength = levels.length;

            // hd turned off
            // set quality to last lowest level
            if (true === userSettings.settings.conserveBandwidth) {
                player.setCurrentQuality(levelsLength > 2 ? levelsLength - 2 : levelsLength);
            }
        }

        /**
         * Handle levels event
         *
         * @param event
         */
        function onLevels (event) {

            levels = event.levels;
        }

        /**
         * Handle complete event
         */
        function onComplete () {

            watchProgress.removeItem(vm.item);
        }

        /**
         * Handle time event
         *
         * @param event
         */
        function onTime (event) {

            var position = Math.round(event.position);

            if (false !== requestQualityChange) {
                player.setCurrentQuality(requestQualityChange);
                requestQualityChange = false;
            }

            // occasionally the onTime event fires before the onPlay or onFirstFrame event.
            // so we have to prevent updating the watchProgress before the video has started
            if (!started) {
                return;
            }

            if (!performedConditionalSeek) {
                return performConditionalSeek();
            }

            if (Math.abs(lastPos - position) > 5) {
                lastPos = position;
                watchProgress.handler(vm.item, event.position / event.duration);
            }
        }

        /**
         * Seek to time given in stateParams when set or resume the watch progress
         */
        function performConditionalSeek () {

            // startTime via $stateParams
            if (startTime) {
                player.seek(startTime);

                startTime = null;

                performedConditionalSeek = true;

                return;
            }

            var continueWatching = userSettings.settings.continueWatching && config.options.enableContinueWatching;
            if (continueWatching && angular.isDefined(watchProgressItem)) {
                resumeWatchProgress();

                performedConditionalSeek = true;
            }
        }

        /**
         * Handle time event
         *
         * @param event
         */
        function onAdImpression (event) {

            vm.loading = false;
            $timeout.cancel(loadingTimeout);
        }

        /**
         * Resume video playback at last saved position from watchProgress
         */
        function resumeWatchProgress () {

            var toWatchProgress = watchProgressItem ? watchProgressItem.progress : 0;

            if (toWatchProgress > 0) {
                player.seek(toWatchProgress * vm.item.duration);
            }
        }

        /**
         * @ngdoc method
         * @name jwShowcase.video.VideoController#cardClickHandler
         * @methodOf jwShowcase.video.VideoController
         *
         * @description
         * Handle click event on the card.
         *
         * @param {jwShowcase.core.item}    newItem         Clicked item
         * @param {boolean}                 clickedOnPlay   Did the user clicked on the play button
         */
        function cardClickHandler (newItem, clickedOnPlay) {

            var playlistIndex = playlist.findIndex(byMediaId(newItem.mediaid));

            // same item
            if (vm.item.mediaid === newItem.mediaid) {
                return;
            }

            // update current item and set playlistItem
            vm.item = angular.copy(newItem);

            // if the item is not loaded in the playlist, reload the state
            if (playlistIndex === -1) {
                playlist = generatePlaylist(vm.activeFeed, vm.item);
                player.load(playlist);
                player.play(true);
            } else {
                // start playing item from playlist
                player.playlistItem(playlistIndex);
            }

            updateStateSilently();
            update();

            window.TweenLite.to(document.scrollingElement || document.body, 0.3, {
                scrollTop: 0
            });
        }

        /**
         * @param {string} mediaId
         * @returns {Function}
         */
        function byMediaId (mediaId) {

            return function (cursor) {
                return cursor.mediaid === mediaId;
            };
        }
    }

}());
