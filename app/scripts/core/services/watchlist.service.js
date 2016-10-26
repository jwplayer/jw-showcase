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
        .module('app.core')
        .service('watchlist', watchlist);

    /**
     * @ngdoc service
     * @name app.core.watchlist
     *
     * @requires app.core.dataStore
     */
    watchlist.$inject = ['dataStore'];
    function watchlist (dataStore) {

        this.addItem    = addItem;
        this.hasItem    = hasItem;
        this.removeItem = removeItem;
        this.restore    = restore;
        this.persist    = persist;
        this.clearAll   = clearAll;

        ////////////////

        /**
         * @param {app.core.item} item
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
            })
        }

        /**
         * @ngdoc property
         * @name app.core.watchlist#addItem
         * @propertyOf app.core.watchlist
         *
         * @param {app.core.item} item
         *
         * @description
         * Add given item to watchlist
         */
        function addItem (item) {

            var index = findItemIndex(item),
                clone;

            if (index === -1) {
                clone         = angular.extend({}, item);
                clone.$feedid = clone.$feedid || clone.feedid;
                clone.feedid  = 'watchlist';

                dataStore.watchlistFeed.playlist.unshift(clone);
                persist();
            }
        }

        /**
         * @ngdoc property
         * @name app.core.watchlist#removeItem
         * @propertyOf app.core.watchlist
         *
         * @param {app.core.item} item
         *
         * @description
         * Remove given item to watchlist
         */
        function removeItem (item) {

            var index = findItemIndex(item);

            if (index !== -1) {
                dataStore.watchlistFeed.playlist.splice(index, 1);
                persist();
            }
        }

        /**
         * @ngdoc property
         * @name app.core.watchlist#hasItem
         * @propertyOf app.core.watchlist
         *
         * @param {app.core.item} item
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
         * @name app.core.watchlist#persist
         * @propertyOf app.core.watchlist
         *
         * @description
         * Persist watchlist to localStorage
         */
        function persist () {

            var playlist = dataStore.watchlistFeed.playlist,
                data     = playlist.map(function (item) {
                    return {mediaid: item.mediaid, feedid: item.$feedid};
                });

            if (window.localStorageSupport) {
                try {
                    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                }
                catch (e) {

                }
            }
        }

        /**
         * @ngdoc property
         * @name app.core.watchlist#clearAll
         * @propertyOf app.core.watchlist
         *
         * @description
         * Clear watchlist and localStorage
         */
        function clearAll () {

            dataStore.watchlistFeed.playlist = [];
            persist();
        }

        /**
         * @ngdoc property
         * @name app.core.watchlist#restore
         * @propertyOf app.core.watchlist
         *
         * @description
         * Restores watchlist from localStorage
         */
        function restore () {

            var data, parsed;

            if (!window.localStorageSupport) {
                return;
            }

            data = window.localStorage.getItem(LOCAL_STORAGE_KEY);

            if (!data) {
                return;
            }

            try {
                parsed = JSON.parse(data);
                parsed.map(function (keys) {
                    var item = dataStore.getItem(keys.mediaid, keys.feedid);

                    if (item) {
                        addItem(item);
                    }
                });
            }
            catch (e) {

            }
        }
    }
})();
