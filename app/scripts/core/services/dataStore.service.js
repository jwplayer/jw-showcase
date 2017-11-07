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
        .service('dataStore', dataStoreService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.dataStore
     *
     * @requires jwShowcase.core.utils
     */
    dataStoreService.$inject = ['FeedModel'];

    function dataStoreService (FeedModel) {

        var self = this;

        /**
         * @ngdoc property
         * @name jwShowcase.core.dataStore#feeds
         * @propertyOf jwShowcase.core.dataStore
         *
         * @type {jwShowcase.core.feed[]}
         * @description
         * All fetched feeds from the playlist's config are stored in this property
         */
        this.feeds = [];

        /**
         * @ngdoc property
         * @name jwShowcase.core.dataStore#watchlistFeed
         * @propertyOf jwShowcase.core.dataStore
         *
         * @type {jwShowcase.core.feed}
         * @description
         * The watchlist feed
         */
        this.watchlistFeed = new FeedModel('saved-videos', 'Saved videos', true);

        /**
         * @ngdoc property
         * @name jwShowcase.core.dataStore#watchProgressFeed
         * @propertyOf jwShowcase.core.dataStore
         *
         * @type {jwShowcase.core.feed}
         * @description
         * The watchProgress feed
         */
        this.watchProgressFeed = new FeedModel('continue-watching', 'Continue watching', true);

        /**
         * @ngdoc property
         * @name jwShowcase.core.dataStore#searchFeed
         * @propertyOf jwShowcase.core.dataStore
         *
         * @type {jwShowcase.core.feed}
         * @description
         * The search feed
         */
        this.searchFeed = new FeedModel('search-feed', 'Search results', true);

        /**
         * @ngdoc method
         * @name jwShowcase.core.dataStore#getItem
         * @methodOf jwShowcase.core.dataStore
         *
         * @description
         * Return item with the given mediaId.
         *
         * @param {string}              mediaId     Id of the item
         *
         * @returns {jwShowcase.core.item|undefined} Found item or undefined when not found
         */
        this.getItem = function (mediaId) {
            return angular.copy(this.getItems().find(byMediaId(mediaId)));
        }.bind(this);

        /**
         * @ngdoc method
         * @name jwShowcase.core.dataStore#getItems
         * @methodOf jwShowcase.core.dataStore
         *
         * @description
         * Return all items
         *
         * @returns jwShowcase.core.item[] All items that are loaded in the dataStore
         */
        this.getItems = function () {

            var items = [];

            angular.forEach(this.feeds, function (feed) {

                // skip watchProgress and watchlist feeds
                if (true === feed.$virtual) {
                    return;
                }

                items = items.concat(feed.playlist);
            });

            // make items unique by mediaid
            items = items.filter(function (item, index, collection) {
                return collection.findIndex(byMediaId(item.mediaid)) === index;
            });

            return items;

        }.bind(this);

        /**
         * @ngdoc method
         * @name jwShowcase.core.dataStore#getFeed
         * @methodOf jwShowcase.core.dataStore
         *
         * @description
         * Return feed with the given feedId.
         *
         * @param {string}              feedId      Id of the feed
         *
         * @returns {jwShowcase.core.feed|undefined} Found feed or undefined when not found
         */
        this.getFeed = function (feedId) {

            if (feedId === this.searchFeed.feedid) {
                return this.searchFeed;
            }

            return this.feeds.find(function (feed) {
                return feed.feedid === feedId;
            });

        }.bind(this);

        /**
         * @param mediaId
         * @returns {Function}
         */
        function byMediaId (mediaId) {

            return function (item) {
                return item.mediaid === mediaId;
            };
        }
    }

}());
