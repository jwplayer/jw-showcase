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
        .service('utils', utils);

    /**
     * @ngdoc service
     * @name app.core.utils
     * @description Collection of utility functions
     */
    function utils () {

        this.flatMap                = flatMap;
        this.ucfirst                = ucfirst;
        this.getTransitionEventName = getTransitionEventName;
        this.getVideoDurationByItem = getVideoDurationByItem;
        this.debounce               = debounce;

        ////////////////////////

        /**
         * @ngdoc method
         * @name app.core.utils#flatMap
         * @methodOf app.core.utils
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
         * @name app.core.utils#ucfirst
         * @methodOf app.core.utils
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
         * @name app.core.utils#getTransitionEventName
         * @methodOf app.core.utils
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
         * Find duration in item sources and return it in seconds or minutes format.
         *
         * @param {app.core.item} item Playlist item
         * @returns {string} The found duration with sec or min suffix.
         */
        function getVideoDurationByItem (item) {

            var sourceWithDuration = item.sources
                .find(function (source) {
                    return source.duration > 0;
                });

            if (!sourceWithDuration) {
                return '0 sec';
            }

            if (sourceWithDuration.duration < 60) {
                return sourceWithDuration.duration + ' sec';
            }

            return Math.ceil(sourceWithDuration.duration / 60) + ' min';
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
    }
}());
