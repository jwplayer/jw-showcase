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
        .module('app.core')
        .service('dataStore', dataStoreService);

    /**
     * @ngdoc service
     * @name app.core.dataStore
     *
     * @requires app.core.utils
     */
    dataStoreService.$inject = [];
    function dataStoreService () {

        /**
         * @ngdoc property
         * @name app.core.dataStore#featuredFeed
         * @propertyOf app.core.dataStore
         *
         * @type {app.core.feed}
         * @description
         * The featured feed is stored in this property
         */
        this.featuredFeed = null;

        /**
         * @ngdoc property
         * @name app.core.dataStore#feeds
         * @propertyOf app.core.dataStore
         *
         * @type {app.core.feed[]}
         * @description
         * All fetched feeds from the playlist's config are stored in this property
         */
        this.feeds = [];

        /**
         * @ngdoc property
         * @name app.core.dataStore#watchlistFeed
         * @propertyOf app.core.dataStore
         *
         * @type {app.core.feed}
         * @description
         * The watchlist feed
         */
        this.watchlistFeed = {
            feedid:   'watchlist',
            title:    'Watchlist',
            playlist: []
        };

        /**
         * @ngdoc property
         * @name app.core.dataStore#watchProgressFeed
         * @propertyOf app.core.dataStore
         *
         * @type {app.core.feed}
         * @description
         * The watchProgress feed
         */
        this.watchProgressFeed = {
            feedid:   'watchProgress',
            title:    'Continue watching',
            playlist: []
        };

        /**
         * @ngdoc property
         * @name app.core.dataStore#searchFeed
         * @propertyOf app.core.dataStore
         *
         * @type {app.core.feed}
         * @description
         * The search feed
         */
        this.searchFeed = {
            id:       'search',
            title:    'Search results',
            playlist: []
        };

        /**
         * @ngdoc method
         * @name app.core.dataStore#getItem
         * @methodOf app.core.dataStore
         *
         * @description
         * Return item with the given mediaId.
         *
         * @param {string}              mediaId     Id of the item
         * @param {string}              feedId      Id of the feed
         *
         * @returns {app.core.item|undefined} Found item or undefined when not found
         */
        this.getItem = function (mediaId, feedId) {

            var feed = this.getFeed(feedId),
                item;

            if (!feed) {
                return;
            }

            item = feed.playlist.find(function (item) {
                return item.mediaid === mediaId;
            });

            return item ? angular.extend({}, item) : undefined;
        }.bind(this);

        /**
         * @ngdoc method
         * @name app.core.dataStore#getItems
         * @methodOf app.core.dataStore
         *
         * @description
         * Return all items
         *
         * @returns app.core.item[] All items that are loaded in the dataStore
         */
        this.getItems = function () {

            var items = [];

            if (this.featuredFeed) {
                items = items.concat(this.featuredFeed.playlist);
            }

            angular.forEach(this.feeds, function (feed) {
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
         * @name app.core.dataStore#getFeed
         * @methodOf app.core.dataStore
         *
         * @description
         * Return feed with the given feedId.
         *
         * @param {string}              feedId      Id of the feed
         *
         * @returns {app.core.feed|undefined} Found feed or undefined when not found
         */
        this.getFeed = function (feedId) {

            var allFeeds = this.feeds,
                feed;

            if (this.featuredFeed) {
                allFeeds = allFeeds.concat([this.featuredFeed]);
            }

            // concat watchlist and watchProgress feeds
            allFeeds = allFeeds.concat([this.watchlistFeed, this.watchProgressFeed]);

            feed = allFeeds.find(function (feed) {
                return feed.feedid === feedId;
            });

            return feed ? angular.extend({}, feed) : undefined;
        }.bind(this);

        /**
         * @param mediaId
         * @returns {Function}
         */
        function byMediaId (mediaId) {

            return function (item) {
                return item.mediaid === mediaId;
            }
        }
    }

}());
