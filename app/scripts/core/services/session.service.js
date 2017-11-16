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
        .service('session', session);

    /**
     * @ngdoc service
     * @name jwShowcase.core.session
     */
    session.$inject = [];
    function session () {

        this.save  = save;
        this.load  = load;
        this.clear = clear;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.session#load
         * @methodOf jwShowcase.core.session
         *
         * @description
         * Get value from localStorage with the given key. Defaults to defaultValue.
         *
         * @param {string}  key             The key to load.
         * @param {*}       defaultValue    This value is returned when key does not exist.
         */
        function load (key, defaultValue) {

            var value;

            if (!window.localStorageSupport) {
                return defaultValue;
            }

            value = window.localStorage.getItem(key);

            if (!angular.isDefined(value) || null == value) {
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
         * @ngdoc method
         * @name jwShowcase.core.session#save
         * @methodOf jwShowcase.core.session
         *
         * @description
         * Save value in localStorage with the given key.
         *
         * @param {string}  key      Key to identify the value.
         * @param {*}       value    Value to store.
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
         * @ngdoc method
         * @name jwShowcase.core.session#clear
         * @methodOf jwShowcase.core.session
         *
         * @description
         * Clears the given key from the localStorage.
         *
         * @param {string}  key             The key to clear.
         */
        function clear (key) {

            if (!window.localStorageSupport) {
                return;
            }

            window.localStorage.removeItem(key);
        }
    }

}());
