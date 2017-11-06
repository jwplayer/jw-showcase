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

    var LOCAL_STORAGE_KEY = 'jwshowcase.watchprogress';
    var LIFETIME          = 86400000 * 30;
    var MIN_PROGRESS      = 0.1;
    var MAX_PROGRESS      = 0.9;

    angular
        .module('jwShowcase.core')
        .service('watchProgress', watchProgress);

    /**
     * @ngdoc service
     * @name jwShowcase.core.watchProgress
     *
     * @requires $q
     * @requires jwShowcase.core.dataStore
     * @requires jwShowcase.core.session
     * @requires jwShowcase.core.api
     */
    watchProgress.$inject = ['$q', 'dataStore', 'session', 'api'];

    function watchProgress ($q, dataStore, session, api) {

        this.handler    = handler;
        this.saveItem   = saveItem;
        this.removeItem = removeItem;
        this.getItem    = getItem;
        this.hasItem    = hasItem;
        this.restore    = restore;
        this.clearAll   = clearAll;

        ////////////////

        /**
         * @param {jwShowcase.core.item} item
         * @private
         */
        function findProgressIndex (item) {

            var playlist = dataStore.watchProgressFeed.playlist;

            return playlist.findIndex(function (current) {
                return current.mediaid === item.mediaid;
            });
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#handler
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @param {jwShowcase.core.item}    item
         * @param {number}                  progress
         *
         * @description
         * Progress update handler
         */
        function handler (item, progress) {

            if (angular.isNumber(progress) && progress >= MIN_PROGRESS && progress < MAX_PROGRESS) {
                return saveItem(item, progress);
            }

            // item is not valid, remove from watch progress feed
            if (hasItem(item)) {
                removeItem(item);
            }
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#hasItem
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Returns true if given item has saved watchProgress
         */
        function hasItem (item) {

            return findProgressIndex(item) !== -1;
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#saveItem
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Save item to watchProgress
         */
        function saveItem (item, progress) {

            var playlist  = dataStore.watchProgressFeed.playlist,
                index     = findProgressIndex(item),
                savedItem = index > -1 ? playlist[index] : angular.copy(item);

            // item is not in watchProgress
            if (index === -1) {
                playlist.unshift(savedItem);
            }

            // set/update progress and last watched
            savedItem.progress    = progress;
            savedItem.lastWatched = +new Date();

            playlist.sort(sortOnLastWatched);
            persist();
        }

        /**
         * Get watch progress item or undefined
         * @param {jwShowcase.core.item} item
         *
         * @returns {jwShowcase.core.item}
         */
        function getItem (item) {

            var index    = findProgressIndex(item),
                playlist = dataStore.watchProgressFeed.playlist;

            return playlist[index];
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#removeItem
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Remove item from watchProgress feed
         */
        function removeItem (item) {

            var playlist = dataStore.watchProgressFeed.playlist,
                index    = findProgressIndex(item);

            if (index !== -1) {
                playlist.splice(index, 1);
                persist();
            }
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#clearAll
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Remove all items from watchProgress feed and localStorage
         */
        function clearAll () {

            dataStore.watchProgressFeed.playlist = [];
            persist();
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#persist
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Persist watchProgress to localStorage
         */
        function persist () {

            session.save(LOCAL_STORAGE_KEY, dataStore.watchProgressFeed.playlist.map(function (item) {
                return {
                    mediaid:     item.mediaid,
                    feedid:      item.feedid,
                    progress:    item.progress,
                    lastWatched: item.lastWatched
                };
            }));
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchProgress#restore
         * @propertyOf jwShowcase.core.watchProgress
         *
         * @description
         * Restores watchProgress from localStorage
         */
        function restore () {

            var time = +new Date();

            var promises = session.load(LOCAL_STORAGE_KEY, [])
                .filter(isValid)
                .sort(sortOnLastWatched)
                .map(function (data) {
                    // try to get item from dataStore
                    var item = dataStore.getItem(data.mediaid);

                    // set watchProgress properties
                    if (item) {
                        item.progress    = data.progress;
                        item.lastWatched = data.lastWatched;
                    }

                    // try fetching the item from the API if it isn't already loaded by Showcase.
                    return api.getItem(data.mediaid)
                        .then(function (item) {
                            item.progress    = data.progress;
                            item.lastWatched = data.lastWatched;

                            return item;
                        })
                        .catch(function () {
                            // item doesn't exist anymore, return undefined so that the rest don't fail.
                            return undefined;
                        });
                });

            return $q.all(promises).then(function (items) {
                // add all items to feed.
                dataStore.watchProgressFeed.playlist = items.filter(angular.isDefined);

                // persist valid data to session.
                persist();
            });

            /**
             * Test if the given item from localStorage is valid
             *
             * @param {Object} item
             * @returns {boolean}
             */
            function isValid (item) {

                // item has mediaid
                if (!item.mediaid) {
                    return false;
                }

                if (item.progress < MIN_PROGRESS || item.progress > MAX_PROGRESS) {
                    return false;
                }

                // filter out older items older than lifetime
                return time - item.lastWatched < LIFETIME;
            }
        }

        /**
         * Sort on last watched value DESC
         *
         * @param {jwShowcase.core.item} a
         * @param {jwShowcase.core.item} b
         *
         * @returns {number}
         */
        function sortOnLastWatched (a, b) {

            if (a.lastWatched < b.lastWatched) {
                return 1;
            }

            if (a.lastWatched > b.lastWatched) {
                return -1;
            }

            return 0;
        }
    }

}());
