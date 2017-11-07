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
        .decorator('$httpBackend', $httpBackendDecorator)
        .service('api', apiService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.api
     *
     * @requires $http
     * @requires $q
     * @requires jwShowcase.config
     */
    apiService.$inject = ['$http', '$q', 'config', 'utils'];

    function apiService ($http, $q, config, utils) {

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#getItem
         * @methodOf jwShowcase.core.api
         *
         * @param {string} mediaId Id of the item
         * @description
         * Get media from jw platform
         *
         * @resolves {jwShowcase.core.item}
         * @returns {Promise} Promise which will be resolved when the request is completed.
         */
        this.getItem = function (mediaId) {

            // reject when mediaId is empty or no string
            if (!angular.isString(mediaId) || mediaId === '') {
                return $q.reject(new Error('mediaId is not given or not a string'));
            }

            return getItem(config.contentService + '/v2/media/' + mediaId);
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#getFeed
         * @methodOf jwShowcase.core.api
         *
         * @param {string} feedId Id of the feed
         * @description
         * Get feed from jw platform
         *
         * @resolves {jwShowcase.core.feed}
         * @returns {Promise} Promise which will be resolved when the request is completed.
         */
        this.getFeed = function (feedId) {

            // reject when feedId is empty or no string
            if (!angular.isString(feedId) || feedId === '') {
                return $q.reject(new Error('feedId is not given or not a string'));
            }

            return getFeed(config.contentService + '/v2/playlists/' + feedId);
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#getSearchFeed
         * @methodOf jwShowcase.core.api
         *
         * @param {string} searchPlaylist Search playlist
         * @param {string} phrase Search phrase
         * @description
         * Get search feed from jw platform with given search phrase
         *
         * @resolves {jwShowcase.core.feed}
         * @returns {Promise} Promise which be resolved when the request is completed.
         */
        this.getSearchFeed = function (searchPlaylist, phrase) {

            // reject when searchPlaylist is missing
            if (!searchPlaylist) {
                return $q.reject(new Error('searchPlaylist is missing'));
            }

            // reject when feedId is empty or no string
            if (!angular.isString(phrase) || phrase === '') {
                return $q.reject(new Error('search phrase is not given or not a string'));
            }

            var url = config.contentService + '/v2/playlists/' + searchPlaylist;

            return getFeed(url + '?search=' + encodeURIComponent(phrase));

        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#patchItemWithCaptions
         * @methodOf jwShowcase.core.api
         * @description
         * Add captions to a given item
         *
         * @param {object} item
         * @param {string} phrase
         * @returns {*}
         */
        this.patchItemWithCaptions = function (item, phrase) {
            if (!item.tracks) {
                return $q.resolve(item);
            }

            var captionUrl  = null;
            var captionHits = null;

            item.tracks.forEach(function (track) {
                if (track.kind === 'captions' && /\.vtt$/.test(track.file)) {
                    captionUrl  = track.file;
                    captionHits = track.hits;
                }

                if (track.kind === 'thumbnails') {
                    item.thumbnails = track.file;
                }
            });

            if (!captionUrl || !captionHits) {
                return $q.resolve(item);
            }

            return findMatches(captionUrl, captionHits).then(function (matches) {
                item.captionMatches = matches;
            });

            function findMatches (location, positions) {
                return $http.get(location).then(function (response) {
                    var vtt = response.data;

                    return $q(function (resolve, reject) {
                        var parser   = new WebVTT.Parser(window, WebVTT.StringDecoder());
                        var segments = [];

                        parser.onparsingerror = reject;
                        parser.oncue          = function (cue) {
                            segments.push(cue);
                        };

                        parser.onflush = function () {
                            resolve(positions.map(function (position) {
                                var segment = segments[position - 1];
                                var regex   = new RegExp('(' + phrase + ')', 'ig');

                                return {
                                    text:        segment.text,
                                    time:        segment.startTime,
                                    highlighted: segment.text.replace(regex, '<span>$1</span>')
                                };
                            }));
                        };

                        parser.parse(vtt);
                        parser.flush();
                    });
                });
            }
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#getRecommendationsFeed
         * @methodOf jwShowcase.core.api
         *
         * @param {string} recommendationsPlaylist Recommendations playlist
         * @param {string} mediaId Id of item to get related items
         * @description
         * Get recommendations feed from jw platform with given mediaId
         *
         * @resolves {jwShowcase.core.feed}
         * @returns {Promise} Promise which be resolved when the request is completed.
         */
        this.getRecommendationsFeed = function (recommendationsPlaylist, mediaId) {

            // reject when recommendationsPlaylist is missing
            if (!recommendationsPlaylist) {
                return $q.reject(new Error('recommendationsPlaylist is missing'));
            }

            // reject when mediaId is empty or no string
            if (!angular.isString(mediaId) || mediaId === '') {
                return $q.reject(new Error('media id is not given or not a string'));
            }

            return getFeed(config.contentService + '/v2/playlists/' + recommendationsPlaylist +
                '?related_media_id=' + mediaId);
        };

        /**
         * @ngdoc method
         * @name jwShowcase.core.api#getPlayer
         * @methodOf jwShowcase.core.api
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
                defer.reject(new Error('Player with id `' + playerId + '` could not be loaded'));
            };

            script.async = true;
            script.src   = config.contentService + '/libraries/' + playerId + '.js';
            document.body.appendChild(script);

            return defer.promise;
        };

        /**
         * Get item from the given URL
         *
         * @param {string} url
         * @returns {Promise}
         */
        function getItem (url) {

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
                .then(function (feed) {
                    if (!angular.isArray(feed.playlist) || !feed.playlist.length) {
                        return $q.reject(new Error('Item not found'));
                    }

                    return feed.playlist[0];
                })
                .then(fixItemUrls)
                .catch(function () {
                    return $q.reject('Failed to get item');
                });
        }

        /**
         * Get feed from the given URL.
         *
         * @param {string} url
         * @returns {Promise}
         */
        function getFeed (url) {

            return $http.get(url)
                .then(getFeedCompleted, getFeedFailed);

            function getFeedCompleted (response) {

                var feed = response.data;

                // the search feed can return an empty playlist, so we can show "No results for ..."
                if (feed && 'SEARCH' === feed.kind) {
                    feed.playlist = feed.playlist || [];
                }

                if (!feed || !angular.isArray(feed.playlist)) {
                    return getFeedFailed(response);
                }

                feed.playlist = feed.playlist
                    .map(fixItemUrls);

                return feed;
            }

            function getFeedFailed (response) {

                var message = 'Failed to get feed from `' + url + '`';

                if (404 === response.status) {
                    message = 'Feed with url `' + url + '` does not exist';
                }

                return $q.reject(new Error(message));
            }
        }

        /**
         * Fix urls in item and sources
         *
         * @param {jwShowcase.core.item} [item]
         * @returns {jwShowcase.core.item}
         */
        function fixItemUrls (item) {

            if (!angular.isObject(item)) {
                return item;
            }

            item.image = fixUrl(item.image);

            if (angular.isArray(item.sources)) {
                item.sources = item.sources.map(function (source) {
                    source.file = fixUrl(source.file);
                    return source;
                });
            }

            if (angular.isArray(item.tracks)) {
                item.tracks = item.tracks.map(function (track) {
                    track.file = fixUrl(track.file);
                    return track;
                });
            }

            return item;
        }

        /**
         * Fix url by replacing '//' with 'https://'
         *
         * @param {string} [url]
         * @returns {*}
         */
        function fixUrl (url) {

            var protocol = /^https/.test(window.location.href) ? 'https' : 'http';

            if (angular.isString(url)) {

                // url starts with //
                if (0 === url.indexOf('//')) {
                    return protocol + '://' + url.substr(2);
                }

                // replace http(s) with current window protocol
                return url.replace(/^https?/, protocol);
            }

            return url;
        }
    }

    /**
     * @name jwShowcase.core.feed
     * @type Object
     * @property {string}                   description    Feed description
     * @property {string}                   feedid         Feed id
     * @property {string}                   kind           Feed kind
     * @property {jwShowcase.core.item[]}   playlist       Feed playlist
     * @property {string}                   title          Feed title
     * @property {boolean}                  dynamic        True if the feed is dynamic
     */

    /**
     * @name jwShowcase.core.item
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
     * @property {number}               [lastWatched]   Last watched timestamp
     * @property {number}               [progress]      Watch progress percentage
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
