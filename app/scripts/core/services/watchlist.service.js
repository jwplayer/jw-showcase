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

    var LOCAL_STORAGE_KEY = 'jwshowcase.watchlist';

    angular
        .module('jwShowcase.core')
        .service('watchlist', watchlist);

    /**
     * @ngdoc service
     * @name jwShowcase.core.watchlist
     *
     * @requires $q
     * @requires jwShowcase.core.dataStore
     * @requires jwShowcase.core.api
     * @requires jwShowcase.core.session
     * @requires jwShowcase.core.serviceWorker
     */
    watchlist.$inject = ['$q', 'dataStore', 'api', 'session', 'serviceWorker'];

    function watchlist ($q, dataStore, api, session, serviceWorker) {

        this.addItem    = addItem;
        this.hasItem    = hasItem;
        this.removeItem = removeItem;
        this.restore    = restore;
        this.persist    = persist;
        this.clearAll   = clearAll;

        ////////////////

        /**
         * @param {jwShowcase.core.item} item
         * @description
         * Find index of given item in watchlist
         *
         * @private
         * @returns {number}
         */
        function findItemIndex (item) {

            var playlist = dataStore.watchlistFeed.playlist;

            return playlist.findIndex(function (current) {
                return item.mediaid === current.mediaid;
            });
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#addItem
         * @propertyOf jwShowcase.core.watchlist
         *
         * @param {jwShowcase.core.item} item
         * @param {boolean} [download=true]
         *
         * @description
         * Add given item to watchlist
         */
        function addItem (item, download) {

            var index = findItemIndex(item);

            download = angular.isDefined(download) ? download : true;

            if (index === -1) {
                dataStore.watchlistFeed.playlist.unshift(angular.copy(item));
                persist();

                if (download && serviceWorker.isSupported()) {
                    return serviceWorker.downloadItem(item);
                }
            }
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#removeItem
         * @propertyOf jwShowcase.core.watchlist
         *
         * @param {jwShowcase.core.item} item
         *
         * @description
         * Remove given item to watchlist
         */
        function removeItem (item) {

            var index = findItemIndex(item);

            if (index !== -1) {
                dataStore.watchlistFeed.playlist.splice(index, 1);
                persist();

                if (serviceWorker.isSupported()) {
                    serviceWorker.removeDownloadedItem(item);
                }
            }
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#hasItem
         * @propertyOf jwShowcase.core.watchlist
         *
         * @param {jwShowcase.core.item} item
         *
         * @description
         * Returns true if the given item exists in the watchlist
         *
         * @returns {boolean}
         */
        function hasItem (item) {

            return findItemIndex(item) !== -1;
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#persist
         * @propertyOf jwShowcase.core.watchlist
         *
         * @description
         * Persist watchlist to localStorage
         */
        function persist () {

            session.save(LOCAL_STORAGE_KEY, dataStore.watchlistFeed.playlist.map(function (item) {
                return {mediaid: item.mediaid, feedid: item.feedid};
            }));
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#clearAll
         * @propertyOf jwShowcase.core.watchlist
         *
         * @description
         * Clear watchlist and session
         */
        function clearAll () {

            if (serviceWorker.isSupported()) {
                angular.forEach(dataStore.watchlistFeed.playlist, function (item) {
                    serviceWorker.removeDownloadedItem(item);
                });
            }

            // empty playlist in dataStore
            dataStore.watchlistFeed.playlist = [];

            // clear data in session
            session.clear(LOCAL_STORAGE_KEY);
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.watchlist#restore
         * @propertyOf jwShowcase.core.watchlist
         *
         * @description
         * Restores watchlist from session
         */
        function restore () {

            var promises = session
                .load(LOCAL_STORAGE_KEY, [])
                .map(function (data) {
                    // try to get item from dataStore
                    var item = dataStore.getItem(data.mediaid);

                    // try fetching the item from the API if it isn't already loaded by Showcase.
                    return item || api.getItem(data.mediaid).catch(function () {

                        // item doesn't exist anymore, return undefined so that the rest don't fail.
                        return undefined;
                    });
                });

            return $q.all(promises)
                .then(function (items) {
                    // add all items to feed.
                    dataStore.watchlistFeed.playlist = items.filter(angular.isDefined);

                    // persist valid data to session.
                    persist();
                });
        }
    }

}());
