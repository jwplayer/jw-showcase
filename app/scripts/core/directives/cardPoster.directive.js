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

    var LARGE_SCREEN                        = window.matchMedia('(min-device-width: 960px)').matches,
        THUMBNAIL_AUTOMATIC_TIMEOUT         = 500,
        THUMBNAIL_AUTOMATIC_INTERVAL        = 2300,
        CONTINUE_WATCHING_THUMBNAIL_QUALITY = 320,
        SEARCH_THUMBNAIL_QUALITY            = 320,
        DEFAULT_CARD_THUMBNAIL_QUALITY      = 120,
        FEATURED_CARD_THUMBNAIL_QUALITY     = 320;

    angular
        .module('jwShowcase.core')
        .directive('jwCardPoster', jwCardPoster);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwCardPoster
     * @module jwShowcase.core
     *
     * @description
     * # jwCardPoster
     * The `jwCardPoster` directive is responsible for showing the item poster or thumbnail.
     *
     * @todo changes based on upcoming updates to thumbstrips from feed
     */

    jwCardPoster.$inject = ['$q', 'dataStore', 'platform', 'utils', 'Thumbstrip'];
    function jwCardPoster ($q, dataStore, platform, utils, Thumbstrip) {

        return {
            link:    link,
            require: '^jwCard'
        };

        function link (scope, element, attrs, jwCard) {

            var itemPosterUrl,
                feed,
                progressPreview       = false,
                mousePreview          = false,
                mouseOver             = false,
                thumbstrip            = new Thumbstrip(),
                thumbnailIndex        = 0,
                thumbnailsAutoTimeout = null,
                thumbnailsTrack;

            activate();

            ///////////////

            /**
             * Initialize directive
             */
            function activate () {

                var watchProgressFeed = angular.isNumber(jwCard.item.progress),
                    featuredCard      = jwCard.featured;

                itemPosterUrl   = generatePosterUrl();
                thumbnailsTrack = getThumbnailsTrack();

                scope.$on('caption_changed', function (event, data) {
                    showPositionThumbnail(data.thumbnails, data.caption.time);
                });

                scope.$on('caption_reset', function () {
                    showDefaultPoster();
                });

                // if the thumbnailTrack doesn't exist or enablePreview is false there is no need to continue
                if (!thumbnailsTrack || !jwCard.enablePreview) {
                    return showDefaultPoster();
                }

                if (!watchProgressFeed && !platform.isTouch && featuredCard) {

                    // set mouse preview flag to true
                    mousePreview = true;

                    // bind to jwCard element
                    element.parent()
                        .on('mouseenter', cardMouseEnterHandler)
                        .on('mouseleave', cardMouseLeaveHandler);
                }

                // set watch progress
                if (watchProgressFeed && jwCard.enablePreview) {

                    // set progressPreview flag to true
                    progressPreview = true;

                    // add watcher to listen to progress updates
                    scope.$watch(function () {
                        return jwCard.item.progress;
                    }, function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            showProgressThumbnail();
                        }
                    });
                }

                showDefaultPoster();
            }

            /**
             * Find child element
             * @param {string} selector
             * @returns {Object}
             */
            function findElement (selector) {

                return angular.element(element[0].querySelector(selector));
            }

            /**
             * Find child elements
             * @param {string} selector
             * @returns {Object}
             */
            function findElements (selector) {

                return angular.element(element[0].querySelectorAll(selector));
            }

            /**
             * Called when the mouse enters the card element
             */
            function cardMouseEnterHandler () {

                var quality = jwCard.featured ? FEATURED_CARD_THUMBNAIL_QUALITY : DEFAULT_CARD_THUMBNAIL_QUALITY;

                mouseOver = true;

                // thumbnails are not loaded yet
                thumbstrip
                    .load(thumbnailsTrack.file, quality)
                    .then(function () {
                        clearTimeout(thumbnailsAutoTimeout);
                        thumbnailsAutoTimeout = setTimeout(showNextThumbnail, THUMBNAIL_AUTOMATIC_TIMEOUT);
                    });
            }

            /**
             * Called when the mouse leaves the card element
             */
            function cardMouseLeaveHandler () {

                mouseOver = false;

                // reset index
                thumbnailIndex = 0;
            }

            /**
             * Replace current poster with default item poster
             */
            function showDefaultPoster () {

                var posterElement;

                // show thumb of current progress when a thumbnailsTrack is defined and feedid is continue watching
                if (true === progressPreview) {

                    return thumbstrip
                        .load(thumbnailsTrack.file, CONTINUE_WATCHING_THUMBNAIL_QUALITY)
                        .then(showProgressThumbnail);
                }

                posterElement = findElement('.jw-card-poster').clone();
                posterElement
                    .css({
                        'background':     'url(' + itemPosterUrl + ') no-repeat center',
                        'backgroundSize': 'cover'
                    });

                replacePosterElement(posterElement);
            }

            /**
             * Show thumbnail closes to the item's progress
             */
            function showProgressThumbnail () {

                var position = jwCard.item.progress * jwCard.item.duration;

                thumbstrip
                    .getThumbnails()
                    .then(function (thumbnails) {
                        return thumbnails.find(function (item) {
                            return item.start < position && item.end >= position;
                        });
                    })
                    .then(preloadImage)
                    .then(showThumbnail);
            }

            /**
             * Show thumbnail closest to the item's position
             * @param url
             * @param position
             */
            function showPositionThumbnail (url, position) {
                thumbstrip.load(url, SEARCH_THUMBNAIL_QUALITY)
                    .then(function (thumbnails) {
                        return thumbnails.find(function (item) {
                            return item.start <= position && item.end >= position;
                        });
                    })
                    .then(preloadImage)
                    .then(showThumbnail);
            }

            /**
             * Create a poster element from the given thumb
             * @param {Object} thumb
             */
            function showThumbnail (thumb) {
                var posterElement,
                    x, y, w;

                if (!thumb) {
                    return;
                }

                posterElement = findElement('.jw-card-poster.is-active').clone();

                // if thumb contains media fragment {@link https://www.w3.org/TR/media-frags/#naming-space}
                if (thumb.xywh.length) {

                    if (thumb.xywh[0] === 'pixel') {
                        x = thumb.xywh[1] / (thumb.image.width - thumb.xywh[3]) * 100;
                        y = thumb.xywh[2] / (thumb.image.height - thumb.xywh[4]) * 100;
                        w = (100 * (thumb.image.width / thumb.xywh[3]));
                    }

                    posterElement.css({
                        'background':         'url(' + thumb.image.src + ') no-repeat',
                        'backgroundSize':     w + '%',
                        'backgroundPosition': x + '% ' + y + '%'
                    });

                    return replacePosterElement(posterElement);
                }

                // show the full thumbnail
                posterElement.css({
                    'background':         'url(' + thumb.image.src + ') no-repeat',
                    'backgroundSize':     'cover',
                    'backgroundPosition': 'center'
                });

                replacePosterElement(posterElement);
            }

            /**
             * Replace current poster with given poster element
             * @param {Object} posterElement
             */
            function replacePosterElement (posterElement) {

                var current = findElement('.jw-card-poster.is-active');

                element.prepend(posterElement);
                current.removeClass('is-active');

                setTimeout(function () {
                    findElements('.jw-card-poster:not(.is-active)').remove();
                }, 300);
            }

            /**
             * Update to the next thumbnail, this functions repeats itself after the THUMBNAIL_AUTOMATIC_INTERVAL
             * timeout.
             */
            function showNextThumbnail () {

                if (!mouseOver) {
                    showDefaultPoster();
                    return;
                }

                thumbnailIndex = thumbnailIndex + 1;

                thumbstrip
                    .getThumbnails()
                    .then(function (thumbnails) {

                        if (thumbnailIndex >= thumbnails.length - 1) {
                            thumbnailIndex = 0;
                        }

                        return thumbnails[thumbnailIndex];
                    })
                    .then(preloadImage)
                    .then(showThumbnail);

                clearTimeout(thumbnailsAutoTimeout);
                thumbnailsAutoTimeout = setTimeout(showNextThumbnail, THUMBNAIL_AUTOMATIC_INTERVAL);
            }

            /**
             * Generate card poster url
             * @returns {*|string}
             */
            function generatePosterUrl () {

                var width = jwCard.featured ? 1280 : 640;

                // half width when user has a small screen
                if (false === LARGE_SCREEN) {
                    width = width / 2;
                }

                return utils.replaceImageSize(jwCard.item.image, width);
            }

            /**
             * Get thumbnails track from current item
             *
             * @returns {Object|undefined}
             */
            function getThumbnailsTrack () {

                // get thumbnailsTrack from playlist item
                if (angular.isArray(jwCard.item.tracks)) {

                    // in the old feed api the kind is called `thumbnails` while the new feed api uses `thumbnail`.
                    return jwCard.item.tracks.find(function (track) {
                        return track.kind === 'thumbnails' || track.kind === 'thumbnail';
                    });
                }
            }

            /**
             * Preload image
             * @param {Object} data
             * @returns {Promise<Object>}
             */
            function preloadImage (data) {

                var defer = $q.defer();

                if (!data) {
                    return $q.reject();
                }

                var img = new Image();

                img.onload = function () {
                    data.image = img;
                    defer.resolve(data);
                };

                img.src = data.imageUrl;

                return defer.promise;
            }
        }
    }

}());

