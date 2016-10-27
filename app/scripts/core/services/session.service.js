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

    if (!window.localStorageSupport) {
        return;
    }

    angular
        .module('app.core')
        .service('session', session);

    /**
     * @ngdoc service
     * @name app.core.session
     */

    session.$inject = [];
    function session () {

        this.save  = save;
        this.load  = load;
        this.clear = clear;

        ////////////////

        /**
         * Get value from localStorage defaulting to defaultValue
         *
         * @param {string} key
         * @param {*}      defaultValue
         * @returns {*}
         */
        function load (key, defaultValue) {

            var value;

            if (!window.localStorageSupport) {
                return defaultValue;
            }

            value = window.localStorage.getItem(key);

            if (!angular.isDefined(value)) {
                return defaultValue;
            }

            if (angular.isString(value) && /^[{\[]/.test(value)) {
                try {
                    value = JSON.parse(value);
                }
                catch (e) {
                    value = defaultValue;
                }
            }

            return value;
        }

        /**
         * Save value in localStorage
         *
         * @param {string}  key
         * @param {*}       value
         */
        function save (key, value) {

            if (!window.localStorageSupport) {
                return;
            }

            if (angular.isObject(value) || angular.isArray(value)) {

                try {
                    window.localStorage.setItem(key, JSON.stringify(value));
                }
                catch (e) {
                    // noop
                }

                return;
            }

            window.localStorage.setItem(key, value);
        }

        /**
         * Clear value in localStorage
         *
         * @param {string}  key
         */
        function clear (key) {

            if (!window.localStorageSupport) {
                return;
            }

            window.localStorage.removeItem(key);
        }
    }

})();
