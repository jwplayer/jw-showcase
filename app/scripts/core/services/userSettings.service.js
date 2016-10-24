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

    var LOCAL_STORAGE_KEY = 'jwshowcase.usersettings';

    angular
        .module('app.core')
        .service('userSettings', userSettings);

    /**
     * @ngdoc service
     * @name app.core.userSettings
     */
    userSettings.$inject = [];
    function userSettings () {

        var settings = {
            hd:            true,
            watchProgress: true
        };

        this.set      = set;
        this.settings = settings;
        this.restore  = restore;

        ////////////////

        /**
         * @ngdoc property
         * @name app.core.userSettings#set
         * @propertyOf app.core.userSettings
         *
         * @description
         * Set user settings
         *
         * @param {string} key
         * @param {*} value
         */
        function set (key, value) {

            if (angular.isDefined(settings[key])) {
                settings[key] = value;
            }

            persist();
        }

        /**
         * @ngdoc property
         * @name app.core.userSettings#persist
         * @propertyOf app.core.userSettings
         *
         * @description
         * Persist user settings to localStorage
         */
        function persist () {

            if (!window.localStorageSupport) {
                return;
            }

            try {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            }
            catch (e) {

            }
        }

        /**
         * @ngdoc property
         * @name app.core.userSettings#restore
         * @propertyOf app.core.userSettings
         *
         * @description
         * Restores user settings from localStorage
         */
        function restore () {

            var data,
                parsed;

            if (!window.localStorageSupport) {
                return;
            }

            data = window.localStorage.getItem(LOCAL_STORAGE_KEY);

            try {
                parsed = JSON.parse(data);
            } catch (e) {

            }

            if (angular.isObject(parsed)) {
                settings = angular.extend(settings, parsed);
            }
        }
    }
})();