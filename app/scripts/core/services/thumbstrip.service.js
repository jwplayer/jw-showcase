/**
 * Copyright 2017 Longtail Ad Solutions Inc.
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
        .factory('Thumbstrip', thumbstripFactory);

    /**
     * @ngdoc service
     * @name jwShowcase.core.Thumbstrip
     *
     * @description
     * This service is used to load and parse WebVTT thumbstrips.
     */

    thumbstripFactory.$inject = ['$http', '$q', 'utils'];
    function thumbstripFactory ($http, $q, utils) {

        return Thumbstrip;

        function Thumbstrip () {

            var thumbnails = [];
            var thumbnailsTrack;
            var thumbnailsPath;
            var promise;

            this.load          = load;
            this.getThumbnails = getThumbnails;

            //////////////

            function getThumbnails () {

                if (!promise) {
                    throw new Error('Data not loaded');
                }

                return promise;
            }

            /**
             * Load thumbnail WebVTT and image data
             * @param {string} url
             * @param {number} [quality=120]
             * @returns {$q.promise}
             */
            function load (url, quality) {

                var thumbnailsTrackRequest;

                if (quality) {
                    url = utils.replaceImageSize(url, quality);
                }

                if (url === thumbnailsTrack && promise) {
                    return promise;
                }

                thumbnailsTrack        = url;
                thumbnailsPath         = url.split('?')[0].split('/').slice(0, -1).join('/');

                thumbnailsTrackRequest = $http
                    .get(url);

                promise = thumbnailsTrackRequest
                    .then(function (response) {
                        return parseThumbnails(response.data);
                    });

                return promise;
            }

            /**
             * This function gets called when the thumbnail track file is loaded
             * @param {Object} data
             * @returns {$q.promise}
             */
            function parseThumbnails (data) {

                var parser = new WebVTT.Parser(window, WebVTT.StringDecoder()),
                    defer  = $q.defer();

                parser.oncue = function (cue) {

                    var item = {
                        start:    cue.startTime,
                        end:      cue.endTime,
                        imageUrl: cue.text,
                        xywh:     []
                    }, matches;

                    if (!/^https?/.test(item.imageUrl)) {
                        item.imageUrl = thumbnailsPath + '/' + cue.text;
                    }

                    // parse based on {@link https://www.w3.org/TR/media-frags/#naming-space}
                    matches = cue.text.match(/#xywh=(pixel|percent)?:?(\d+),(\d+),(\d+),(\d+)/);
                    if (matches && matches.length) {
                        item.xywh = matches.slice(1);
                        item.xywh[0] = item.xywh[0] || 'pixel';
                    }

                    thumbnails.push(item);
                };

                parser.onflush = function () {
                    defer.resolve(thumbnails);
                };

                parser.onparsingerror = function () {
                    thumbnails = [];
                    defer.reject('vtt parse error');
                };

                parser.parse(data);
                parser.flush();

                return defer.promise;
            }
        }
    }

}());
