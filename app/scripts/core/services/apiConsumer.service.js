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
        .service('apiConsumer', apiConsumerService);

    /**
     * @ngdoc service
     * @name app.core.apiConsumer
     *
     * @requires $q
     * @required config
     * @required app.core.api
     * @required app.core.dataStore
     */
    apiConsumerService.$inject = ['$q', 'config', 'api', 'dataStore'];
    function apiConsumerService ($q, config, api, dataStore) {

        /**
         * @ngdoc method
         * @name app.core.apiConsumer#getFeaturedFeed
         * @methodOf app.core.apiConsumer
         *
         * @description
         * Get featured feed from the {@link app.core.api api} and store it in the
         * {@link app.core.dataStore dataStore}.
         *
         * @returns {Promise} A promise which will be resolved after the api request is finished.
         */
        this.getFeaturedFeed = function () {

            return api
                .getFeed(config.featuredPlaylist)
                .then(updateProp('featuredFeed'));
        };

        /**
         * @ngdoc method
         * @name app.core.apiConsumer#getFeeds
         * @methodOf app.core.apiConsumer
         *
         * @description
         * Get all feeds defined in the config from the {@link app.core.api api} and store it in the
         * {@link app.core.dataStore dataStore}.
         *
         * @returns {Promise} A promise which will be resolved after all api request are finished.
         */
        this.getFeeds = function () {

            var promisesArray = config.playlists.map(function (feedId) {
                    return api.getFeed(feedId);
                }),
                promise       = $q.all(promisesArray);

            return promise
                .then(updateProp('feeds'));
        };

        /**
         * Set data in given prop
         * @param propName
         * @returns {function}
         */
        function updateProp (propName) {

            return function (data) {
                dataStore[propName] = data;
                return data;
            };
        }
    }

}());
