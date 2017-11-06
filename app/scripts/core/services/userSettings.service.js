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
        .module('jwShowcase.core')
        .service('userSettings', userSettings);

    /**
     * @ngdoc service
     * @name jwShowcase.core.userSettings
     *
     * @requires jwShowcase.core.session
     */
    userSettings.$inject = ['session'];
    function userSettings (session) {

        var settings = {
            conserveBandwidth: false,
            continueWatching:  true,
            cookies:           false
        };

        this.set      = set;
        this.settings = settings;
        this.restore  = restore;

        ////////////////

        /**
         * @ngdoc property
         * @name jwShowcase.core.userSettings#set
         * @propertyOf jwShowcase.core.userSettings
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
         * @name jwShowcase.core.userSettings#persist
         * @propertyOf jwShowcase.core.userSettings
         *
         * @description
         * Persist user settings to session
         */
        function persist () {

            session.save(LOCAL_STORAGE_KEY, settings);
        }

        /**
         * @ngdoc property
         * @name jwShowcase.core.userSettings#restore
         * @propertyOf jwShowcase.core.userSettings
         *
         * @description
         * Restore user settings from session
         */
        function restore () {

            var data = session.load(LOCAL_STORAGE_KEY);

            if (angular.isObject(data)) {

                angular.forEach(data, function (value, key) {
                    settings[key] = value;
                });
            }
        }
    }

}());
