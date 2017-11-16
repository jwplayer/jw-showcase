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
        .service('apiConsumer', apiConsumerService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.apiConsumer
     *
     * @requires $q
     * @requires jwShowcase.config
     * @required jwShowcase.core.api
     * @required jwShowcase.core.dataStore
     */
    apiConsumerService.$inject = ['$q', 'config', 'api', 'dataStore', 'FeedModel'];

    function apiConsumerService ($q, config, api, dataStore, FeedModel) {

        var self = this;
        var allFeedsPromise;

        /**
         * @ngdoc method
         * @name jwShowcase.core.apiConsumer#populateFeedModel
         * @methodOf jwShowcase.core.apiConsumer
         *
         * @returns {Promise.<jwShowcase.core.FeedModel>}
         */
        this.populateFeedModel = function (feed) {

            if (!feed.feedid) {
                return $q.reject(new Error('feedid is not defined'));
            }

            // clear playlist
            feed.playlist = [];

            // set promise
            feed.$promise = api.getFeed(feed.feedid)
                .then(function (data) {
                    // merge response data with the feed model
                    angular.merge(feed, data);

                    return feed;
                })
                .catch(function (error) {
                    feed.$error     = error;
                    feed.$navigable = false;

                    return $q.reject(feed);
                });

            return feed.$promise;
        };

        /**
         * Get recommendations feed
         * @param relatedMediaId
         * @returns {Promise.<jwShowcase.core.FeedModel>}
         */
        this.getRecommendationsFeed = function (relatedMediaId) {

            var feedId = config.recommendationsPlaylist;

            if (!feedId) {
                return $q.reject();
            }

            var feed = new FeedModel(feedId, 'Related videos', false);

            return api
                .getRecommendationsFeed(feedId, relatedMediaId)
                .then(function (response) {

                    feed.playlist = response.playlist;

                    if (config.options.showcaseContentOnly) {
                        feed.playlist = feed.playlist.filter(function (item) {
                            return !!dataStore.getItem(item.mediaid);
                        });
                    }

                    return feed;
                })
                .catch(function (error) {
                    feed.$error     = error;
                    feed.$navigable = false;

                    return $q.reject(feed);
                });
        };

        /**
         *
         * @param {string} tag
         * @returns {Promise<jwShowcase.core.feed>}
         */
        this.getFeedForTag = function (tag) {

            var defer = $q.defer(),
                feed  = new FeedModel(tag, tag, true, true);

            // not a string or empty
            if (!angular.isString(tag) || !tag) {
                return $q.resolve(feed);
            }

            // wait for feeds to be resolved
            allFeedsPromise.then(function () {
                feed.playlist = dataStore.getItems().filter(function (item) {
                    return angular.isString(item.tags) && item.tags.split(',').indexOf(tag) !== -1;
                });

                defer.resolve(feed);
            });

            return defer.promise;
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.apiConsumer#getSearchFeed
         * @methodOf jwShowcase.core.apiConsumer
         *
         * @description
         * Get search feed from the {@link jwShowcase.core.api api} and store it in the
         * {@link jwShowcase.core.dataStore dataStore}. Items not known by JW Showcase will be filtered out.
         *
         * @param {string}  searchPhrase        The phrase that should be searched on
         * @param {boolean} [requestCaptions]   Should the search also include caption search results
         *
         * @returns {Promise} A promise which will be resolved after the api request is finished.
         */
        this.getSearchFeed = function (searchPhrase, requestCaptions) {

            var feed = new FeedModel(config.searchPlaylist, 'Search Results');

            // empty searchPhrase
            if (!searchPhrase) {
                return $q.resolve(feed);
            }

            dataStore.searchFeed.feedid = config.searchPlaylist;

            return api
                .getSearchFeed(config.searchPlaylist, searchPhrase)
                .then(function (response) {

                    // set playlist
                    feed.playlist = response.playlist;

                    // filter results to items loaded in Showcase when showcaseContentOnly is true
                    if (config.options.showcaseContentOnly) {
                        feed.playlist = feed.playlist.filter(function (item) {
                            return !!dataStore.getItem(item.mediaid);
                        });
                    }

                    // if enableInVideoSearch and requestCaptions are true, patch the first 10 items in the results
                    // with captions.
                    if (config.options.enableInVideoSearch && requestCaptions) {
                        return $q.all(feed.playlist.slice(0, 10).map(function (item) {
                            return api.patchItemWithCaptions(item, searchPhrase);
                        }));
                    }
                })
                .then(function () {
                    return feed;
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.apiConsumer#loadFeedsFromConfig
         * @methodOf jwShowcase.core.apiConsumer
         *
         * @description
         * Load all feeds from the config file.
         *
         * @returns {Promise} A promise which will be resolved after the api request is finished.
         */
        this.loadFeedsFromConfig = function () {

            var promise,
                feedPromises = [];

            if (!angular.isArray(config.content)) {
                return $q.resolve([]);
            }

            dataStore.feeds = config.content
                .filter(function (row) {
                    return angular.isDefined(row.playlistId);
                })
                .map(function (row) {

                    if (row.playlistId === dataStore.watchProgressFeed.feedid) {
                        return dataStore.watchProgressFeed;
                    }

                    if (row.playlistId === dataStore.watchlistFeed.feedid) {
                        return dataStore.watchlistFeed;
                    }

                    var model = new FeedModel(row.playlistId);
                    promise   = self.populateFeedModel(model)
                        .then(function (response) {
                            // set custom options from dashboard in config content
                            angular.merge(row, extractShowcaseOptions(response));

                            return response;
                        })
                        .catch(function (error) {
                            // show error, but resolve so we can wait for all feeds to be loaded
                            console.error(error);

                            return $q.resolve();
                        });

                    feedPromises.push(promise);

                    return model;
                });

            return (allFeedsPromise = $q.all(feedPromises));
        };

        /**
         * @param mediaId
         * @returns {Function}
         */
        function byMediaId (mediaId) {

            return function (item) {
                return item.mediaid === mediaId;
            };
        }

        /**
         * Extract Showcase options from feed response
         */
        function extractShowcaseOptions (feed) {

            var keys    = ['backgroundColor', 'featured', 'cols', 'enableText', 'enablePreview', 'aspectratio',
                'enableTitle'];
            var options = {};
            var value;

            angular.forEach(keys, function (key) {

                value = feed['showcase.' + key];

                if (!angular.isDefined(value)) {
                    return;
                }

                // convert to boolean
                if (value === 'true' || value === 'false') {
                    options[key] = value === 'true';
                    return;
                }

                // convert to object
                if (angular.isString(value) && '{' === value[0]) {
                    try {
                        options[key] = JSON.parse(value);
                    }
                    catch (e) {
                        console.log('Error while parsing JSON from feed custom option: ' + e.message);
                    }
                    return;
                }

                options[key] = value;
            });

            return options;
        }
    }

}());
