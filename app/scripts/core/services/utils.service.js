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

    /**
     * @const MEDIA_QUERIES
     * @type {<Object>}
     */
    var SCREEN_SIZES = {
        xs: window.matchMedia('(max-width: 540px)'),
        sm: window.matchMedia('(min-width: 541px) and (max-width: 960px)'),
        md: window.matchMedia('(min-width: 961px) and (max-width: 1280px)'),
        lg: window.matchMedia('(min-width: 1281px) and (max-width: 1680px)'),
        xl: window.matchMedia('(min-width: 1681px)')
    };

    angular
        .module('jwShowcase.core')
        .service('utils', utils);

    /**
     * @ngdoc service
     * @name jwShowcase.core.utils
     * @description Collection of utility functions
     */
    utils.$inject = ['$location'];
    function utils ($location) {

        this.flatMap                = flatMap;
        this.ucfirst                = ucfirst;
        this.getTransitionEventName = getTransitionEventName;
        this.getVideoDurationByItem = getVideoDurationByItem;
        this.debounce               = debounce;
        this.getValueForScreenSize  = getValueForScreenSize;
        this.replaceImageSize       = replaceImageSize;
        this.copyToClipboard        = copyToClipboard;
        this.slugify                = slugify;
        this.secondsToISO8601       = secondsToISO8601;
        this.memoize                = memoize;
        this.addStylesheetRules     = addStylesheetRules;
        this.composeFacebookLink    = composeFacebookLink;
        this.composeTwitterLink     = composeTwitterLink;
        this.composeEmailLink       = composeEmailLink;
        this.flexboxSupport         = flexboxSupport;

        ////////////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#flatMap
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Flatten array with map function
         *
         * @param {Array}       array       Input array
         * @param {Function}    transform   Map function
         * @returns {Array}                 Flattened array
         */
        function flatMap (array, transform) {

            return Array.prototype.concat.apply([], array.map(transform));
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#ucfirst
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Uppercase the first character of given string
         *
         * @param   {string} input  Input string
         * @returns {string}        string result
         */
        function ucfirst (input) {

            var string = String(input);

            return string[0].toUpperCase() + string.slice(1);
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#getTransitionEventName
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Returns correct transition event name
         *
         * @param {string}              event   Event name, e.g.: end
         * @returns {string|undefined}          Transition event name for the current navigator
         */
        function getTransitionEventName (event) {

            var el          = document.createElement('fakeelement'),
                transitions = {
                    'transition':       'transition' + event,
                    'OTransition':      'oTransition' + ucfirst(event),
                    'MozTransition':    'transition' + event,
                    'WebkitTransition': 'webkitTransition' + ucfirst(event)
                },
                index;

            for (index in transitions) {
                if (el.style[index] !== undefined) {
                    return transitions[index];
                }
            }
        }

        /**
         * Find duration in item sources and return it in seconds or minutes format. If the duration is 0 the string
         * 'LIVE' will be returned.
         *
         * @param {jwShowcase.core.item} item Playlist item
         * @returns {string} The found duration with sec or min suffix.
         */
        function getVideoDurationByItem (item) {

            var source,
                duration = 0;

            if (angular.isNumber(item.duration)) {

                duration = item.duration;
            }
            else if (angular.isArray(item.sources)) {

                source = item.sources
                    .find(function (source) {
                        return source.duration > 0;
                    });

                if (source && source.duration) {
                    duration = source.duration;
                }
            }

            if (duration === 0) {
                return 'LIVE';
            }

            if (duration < 60) {
                return duration + ' sec';
            }

            return Math.ceil(duration / 60) + ' min';
        }

        /**
         * Debounce the given function `fn` by the given time `wait`.
         *
         * @param {function}    fn      Function to execute after wait.
         * @param {number}      wait    Debounce time in milliseconds
         * @returns {function}          Debounced function
         */
        function debounce (fn, wait) {

            var timeoutId;

            function debounced () {

                var thisArg = this,
                    args    = arguments;

                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    fn.apply(thisArg, args);
                }, wait);
            }

            return debounced;
        }

        /**
         * Get value based on matching screenSize, will return last given screenSize or defaultValue when none did
         * match.
         *
         * @param {Object} screenSizes
         * @param {*}      defaultValue
         *
         * @returns {*} Value
         */
        function getValueForScreenSize (screenSizes, defaultValue) {

            var keys  = Object.keys(screenSizes),
                key,
                index = 0,
                last;

            for (; index < keys.length; index++) {

                key = keys[index];

                if (angular.isDefined(screenSizes[key])) {
                    last = screenSizes[key];
                }

                if (SCREEN_SIZES[key] && true === SCREEN_SIZES[key].matches) {
                    return last;
                }
            }

            return last || defaultValue;
        }

        /**
         * Replace size in image url
         *
         * @param {string} url
         * @param {string} width
         *
         * @returns {string}
         */
        function replaceImageSize (url, width) {

            var matches;

            if (!url) {
                return '';
            }

            matches = url.match(/-(\d+)\.(\w+)$/);

            if (angular.isArray(matches) && matches.length === 3) {
                url = url.replace(matches[0], matches[0].replace(matches[1], width));
            }

            return url;
        }

        /**
         * Copy given string to the clipboard via a hidden input element
         *
         * @param {string} text Text to be copied into the clipboard
         * @returns {boolean} Returns true if the text was copied successful
         */
        function copyToClipboard (text) {

            var inputElement = angular.element('<input type="text" />'),
                success      = false;

            inputElement.css({
                position: 'absolute',
                left:     '-1000px',
                fontSize: '18px'
            });

            inputElement.val(text);

            angular.element(document.body).append(inputElement);

            if (inputElement[0] && inputElement[0].select) {

                inputElement[0].select();

                try {
                    document.execCommand('copy');
                    success = true;
                }
                catch (error) {
                }

                inputElement[0].blur();
            }

            inputElement.remove();

            return success;
        }

        /**
         * Slugify text
         * @param {string} text
         * @param {string} [whitespaceChar=-]
         * @returns {string}
         */
        function slugify (text, whitespaceChar) {

            whitespaceChar = whitespaceChar || '-';

            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
                .replace(/\-/g, whitespaceChar);
        }

        /**
         * Seconds to ISO8601 duration or date string
         * @param {Number} input
         * @param {Boolean} [timeOnly=false]
         * @returns {string}
         */
        function secondsToISO8601 (input, timeOnly) {

            if (!input) {
                return '';
            }

            var result  = 'PT',
                date    = new Date(input ? input * 1000 : 0),
                hours   = date.getUTCHours(),
                minutes = date.getUTCMinutes(),
                seconds = date.getUTCSeconds();

            if (!timeOnly) {
                return date.toISOString();
            }

            if (hours > 0) {
                result += hours + 'H';
            }

            if (minutes > 0) {
                result += minutes + 'M';
            }

            if (seconds > 0) {
                result += seconds + 'S';
            }

            return result;
        }

        /**
         * Memoize result of a function
         * @param {Function} fn
         * @returns {Function}
         */
        function memoize (fn) {
            var result;

            return function () {
                if (result) {
                    return result;
                }
                result = fn.apply(this, Array.prototype.slice.call(arguments));
                return result;
            };
        }

        /**
         * Create a styleSheet and memoize
         */
        var createStyleSheet = memoize(function () {

            var styleEl = document.createElement('style');
            document.head.appendChild(styleEl);

            return styleEl.sheet;
        });

        /**
         * Add styleSheet rules to document
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule}.
         *
         * @param {Array} rules Accepts an array of JSON-encoded declarations
         */
        function addStylesheetRules (rules) {

            var styleSheet = createStyleSheet();

            for (var i = 0, rl = rules.length; i < rl; i++) {
                var j = 1, rule = rules[i], selector = rules[i][0], propStr = '';
                // If the second argument of a rule is an array of arrays, correct our variables.
                if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
                    rule = rule[1];
                    j    = 0;
                }

                for (var pl = rule.length; j < pl; j++) {
                    var prop = rule[j];
                    propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
                }

                // Insert CSS Rule
                styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
            }
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#composeFacebookLink
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Compose a Facebook share link
         *
         * @returns {string}        Share link
         */
        function composeFacebookLink () {

            var facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?u={url}';

            return facebookShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()));
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#composeTwitterLink
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Compose a Twitter share link
         *
         * @returns {string}        Share link
         */
        function composeTwitterLink (title) {

            var twitterShareLink = 'http://twitter.com/share?text={text}&amp;url={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()))
                .replace('{text}', encodeURIComponent(title));
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#composeEmailLink
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Compose a Email share link
         *
         * @returns {string}        Share link
         */
        function composeEmailLink (title) {

            var twitterShareLink = 'mailto:?subject={subject}&body={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()))
                .replace('{subject}', encodeURIComponent(title));
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.utils#flexboxSupport
         * @methodOf jwShowcase.core.utils
         *
         * @description
         * Check if browser has support for flexbox
         *
         * @returns {boolean}
         */
        function flexboxSupport () {
            var testElement           = document.createElement('div');
            var flexboxSupported      = typeof testElement.style.flex !== 'undefined';
            testElement               = null;

            return flexboxSupported;
        }
    }

}());
