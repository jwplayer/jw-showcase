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
        .service('serviceWorker', serviceWorkerService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.serviceWorker
     *
     * @requires $rootScope
     * @requires $timeout
     */
    serviceWorkerService.$inject = ['$rootScope', '$timeout'];
    function serviceWorkerService ($rootScope, $timeout) {

        var self            = this,
            online          = true,
            offlineMediaIds = [];

        this.updateConnectionState = updateConnectionState;
        this.isSupported           = isSupported;
        this.isOnline              = isOnline;
        this.downloadItem          = downloadItem;
        this.removeDownloadedItem  = removeDownloadedItem;
        this.hasDownloadedItem     = hasDownloadedItem;
        this.prefetchPlayer        = prefetchPlayer;
        this.prefetchConfig        = prefetchConfig;

        activate();

        /////////////////

        /**
         * Initialize service
         */
        function activate () {

            if (!isSupported()) {
                return;
            }

            $timeout(updateConnectionState, 50);

            window.caches.keys().then(function (keyList) {
                keyList.map(function (key) {
                    var matches = key.match(/jw-showcase-video-(.*)/);

                    if (matches && matches[1]) {
                        offlineMediaIds.push(matches[1]);
                    }
                });

                $rootScope.$applyAsync();
            });

            window.addEventListener('online', function () {
                updateConnectionState();
                $rootScope.$applyAsync();
            });

            window.addEventListener('offline', function () {
                updateConnectionState();
                $rootScope.$applyAsync();
            });
        }

        /**
         * Returns true if serviceWorker is supported
         * @returns {boolean}
         */
        function isSupported () {

            return window.enablePwa && !window.cordova && 'serviceWorker' in navigator;
        }

        /**
         * Returns true when online
         * @returns {boolean}
         */
        function isOnline () {

            return online;
        }

        /**
         * Download a item and save in cache
         * @param {jwShowcase.core.item} item
         */
        function downloadItem (item) {

            var urls = getUrlsFromItem(item);

            if (!urls.length) {
                return Promise.reject();
            }

            return window.caches.open('jw-showcase-video-' + item.mediaid)
                .then(function (cache) {

                    return cache.match(urls[0]).then(function (cacheItem) {
                        if (cacheItem) {
                            return cacheItem;
                        }

                        var promises = urls.map(function (url) {
                            return window.fetch(url).then(function (response) {
                                return cache.put(url, response);
                            });
                        });

                        return Promise.all(promises)
                            .then(function () {
                                offlineMediaIds.push(item.mediaid);
                                $rootScope.$applyAsync();
                            });
                    });
                });
        }

        /**
         * Remove downloaded item from cache
         * @param {jwShowcase.core.item} item
         */
        function removeDownloadedItem (item) {

            var name = 'jw-showcase-video-' + item.mediaid;

            return window.caches.has(name)
                .then(function (hasCache) {

                    if (hasCache) {
                        return window.caches.delete(name).then(function () {
                            var index = offlineMediaIds.indexOf(item.mediaid);

                            if (index > -1) {
                                offlineMediaIds.splice(index, 1);
                                $rootScope.$applyAsync();
                            }
                        });
                    }

                    return false;
                });
        }

        /**
         * Returns true if the given item has been downloaded
         * @param {jwShowcase.core.item} item
         * @returns {boolean}
         */
        function hasDownloadedItem (item) {

            return offlineMediaIds.indexOf(item.mediaid) !== -1;
        }

        /**
         * Prefetch player dependencies
         * @param {string} repo
         */
        function prefetchPlayer (repo) {

            send({
                type: 'prefetchPlayer',
                repo: repo
            });
        }

        /**
         * Prefetch Showcase config
         * @param {jwShowcase.config} config
         */
        function prefetchConfig (config) {

            config = angular.copy(config);

            if (config.bannerImage) {
                config.bannerImage = config.bannerImage.toString();
            }

            send({
                type:   'prefetchConfig',
                config: config
            });
        }

        /**
         * Send data to the active serviceWorker
         * @param {Object} data
         */
        function send (data) {

            if (!isSupported()) {
                return;
            }

            navigator.serviceWorker.ready.then(function (registered) {
                if (registered.active) {
                    registered.active.postMessage(JSON.stringify(data));
                }
            });
        }

        /**
         * Get all urls that needs to be downloaded for an item
         * @param {jwShowcase.core.item} item
         * @returns {Array}
         */
        function getUrlsFromItem (item) {

            var urls   = [],
                source = item.sources.find(function (source) {
                    return source.type === 'video/mp4' && source.width <= 720;
                });

            if (!source) {
                return [];
            }

            urls.push(source.file);

            if (item.image) {
                urls.push(item.image.replace('720', '1920'));
            }

            urls.push('https://cdn.jwplayer.com/strips/' + item.mediaid + '-120.jpg');

            if (item.tracks) {
                urls = urls.concat(item.tracks.map(function (track) {
                    return track.file;
                }));
            }

            return urls;
        }

        /**
         * Update the connection state
         */
        function updateConnectionState () {

            if (online === navigator.onLine) {
                return;
            }

            online = navigator.onLine;

            if (online) {
                document.body.classList.remove('jw-flag-offline');
            }
            else {
                document.body.classList.add('jw-flag-offline');
            }
        }
    }

}());
