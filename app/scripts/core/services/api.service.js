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
        .decorator('$httpBackend', $httpBackendDecorator)
        .service('api', apiService);

    /**
     * @ngdoc service
     * @name app.core.api
     *
     * @requires $http
     * @requires $log
     */
    apiService.$inject = ['$http', '$q', '$filter'];
    function apiService ($http, $q, $filter) {

        var imageFilter = $filter('jwImage');

        /**
         * @ngdoc method
         * @name app.core.api#getFeed
         * @methodOf app.core.api
         *
         * @param {string} feedId Id of the feed
         * @description
         * Get feed from jw platform
         *
         * @resolves {api.core.feed}
         * @returns {Promise} Promise which be resolved when the request is completed.
         */
        this.getFeed = function (feedId) {

            // reject when feedId is empty or no string
            if (!angular.isString(feedId) || feedId === '') {
                return $q.reject(new Error('feedId is not given or not an string'));
            }

            return $http.get('https://content.jwplatform.com/feeds/' + feedId + '.json')
                .then(getFeedCompleted)
                .catch(getFeedFailed);

            function getFeedCompleted (response) {

                var feed = response.data;

                // map feedid to items once
                if (feed && angular.isArray(feed.playlist)) {
                    feed.playlist = feed.playlist.map(function (item) {
                        item.feedid = feed.feedid;
                        item.image  = imageFilter(item.image);
                        return item;
                    });
                }

                return feed;
            }

            function getFeedFailed (response) {

                var message = 'Failed to get feed with id `' + feedId + '`';

                if (404 === response.status) {
                    message = 'Feed with id `' + feedId + '` does not exist';
                }

                return $q.reject(new Error(message));
            }
        };

        /**
         * @ngdoc method
         * @name app.core.api#getPlayer
         * @methodOf app.core.api
         *
         * @param {string} playerId Id of the player
         * @description
         * Get JW Player library from jw platform by including the library in the DOM
         *
         * @resolves
         * @returns {Promise} Promise which be resolved when the library is loaded.
         */
        this.getPlayer = function (playerId) {

            var defer  = $q.defer(),
                script = document.createElement('script');

            script.type = 'text/javascript';

            script.onload = function () {
                defer.resolve();
            };

            script.onerror = function () {
                defer.reject(new Error('Player with id `' + playerId + '` could not been loaded'));
            };

            script.src = '//content.jwplatform.com/libraries/' + playerId + '.js';
            document.head.appendChild(script);

            return defer.promise;
        };
    }

    /**
     * @name app.core.feed
     * @type Object
     * @property {string}               description    Feed description
     * @property {string}               feedid         Feed id
     * @property {string}               kind           Feed kind
     * @property {api.core.item[]}      playlist       Feed playlist
     * @property {string}               title          Feed title
     */

    /**
     * @name app.core.item
     * @type Object
     * @property {string[]}             custom          Custom parameters
     * @property {string}               description     Video description
     * @property {string}               image           Video poster image
     * @property {string}               link            Link
     * @property {string}               mediaid         Video id
     * @property {string}               feedid          Feed id (set by apiService)
     * @property {number}               pubdate         Publication date timestamp
     * @property {Object[]}             sources         Video sources
     * @property {string}               tags            Tags
     * @property {string}               title           Video title
     * @property {Object[]}             tracks          Tracks
     */

    /**
     * $httpBackendDecorator
     *
     * This decorator will add crossdomain request support for IE9 using XDomainRequest.
     */
    $httpBackendDecorator.$inject = ['$delegate', '$browser'];
    function $httpBackendDecorator ($delegate, $browser) {

        if (!window.XDomainRequest) {
            return $delegate;
        }

        return function (method, url, post, callback, headers, timeout) {

            var location = window.location,
                hostname = location.hostname + (location.port ? ':' + location.port : '');

            url = url.replace('./', 'http://' + hostname + $browser.baseHref());

            if (!/^https?:\/\/([^\?\/]+)/.test(url) || RegExp.$1 === hostname) {
                return $delegate.apply(this, arguments);
            }

            method = method.toUpperCase();
            method = method !== 'GET' ? 'POST' : 'GET';

            //force same protocol
            url = url.replace(/^https?:/, location.protocol);

            doXdrRequest(url, method, timeout, callback);
        };

        /**
         * Do actual XDR request
         *
         * @param {string} url
         * @param {string} method
         * @param {number} timeout
         * @param {function} callback
         */
        function doXdrRequest (url, method, timeout, callback) {

            var xdr        = new window.XDomainRequest();
            xdr.timeout    = timeout || 15000;
            xdr.onprogress = angular.noop;

            xdr.ontimeout = xdr.onerror = function () {
                callback(-1, null, null, '');
            };

            xdr.onload = function () {
                callback(200, xdr.responseText, '', 'OK');
            };

            xdr.open(method, url);
            xdr.send();
        }
    }

}());
