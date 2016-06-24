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
        .service('configResolver', configResolverService);

    /**
     * @ngdoc service
     * @name app.core.configResolver
     *
     * @requires $http
     * @required $q
     * @required config
     */
    configResolverService.$inject = ['$http', '$q'];
    function configResolverService ($http, $q) {

        var configPromise = null;

        this.getConfig = getConfig;

        ////////////////////////

        /**
         * Request config.json once. Returns previous promise if request is already in progress.
         * @returns {$q.promise}
         */
        function getConfig () {

            if (!configPromise) {

                configPromise = $http
                    .get(window.configLocation)
                    .then(getConfigComplete)
                    .catch(getConfigFailed);
            }

            return configPromise;
        }

        /**
         * Called after loading config is complete.
         *
         * @param {Object} response
         * @returns {$q.promise}
         */
        function getConfigComplete (response) {

            try {
                validateConfig(response.data);
            }
            catch (error) {
                return $q.reject(error);
            }

            return response.data;
        }

        /**
         * Called when loading config fails
         * @returns {$q.Promise}
         */
        function getConfigFailed () {

            return $q.reject(new Error('Failed to load config file'));
        }

        /**
         * Validate config properties
         *
         * @param {Object} config
         *
         * @throws {Error}
         */
        function validateConfig (config) {

            var required  = ['player', 'theme', 'siteName', 'description', 'bannerImage', 'footerText'],
                isDefined = angular.isDefined,
                isArray   = angular.isArray,
                isString  = angular.isString,
                missing;

            missing = required
                .filter(function (value) {
                    return !angular.isString(config[value]);
                });

            if (missing.length > 0) {
                throw new Error('The config file is missing the following properties: ' + missing.join(', '));
            }

            if (isDefined(config.playlists) && !isArray(config.playlists)) {
                throw new Error('The config file playlists property should be an array');
            }

            if (isDefined(config.featuredPlaylists) && !isString(config.featuredPlaylist)) {
                throw new Error('The config file featuredPlaylist property should be an string');
            }
        }
    }

}());
