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
        .provider('autoScroll', autoScrollProvider);

    /**
     * @ngdoc service
     * @name app.core.autoScrollProvider
     */

    /**
     * @ngdoc service
     * @name app.core.autoScroll
     *
     * @property {Object} states Registered states
     */
    autoScrollProvider.$inject = [];
    function autoScrollProvider () {

        var states = {};

        /**
         * @ngdoc function
         * @name app.core.autoScrollProvider#register
         * @methodOf app.core.autoScrollProvider
         *
         * @description
         * Registers a state that needs to make
         *
         * @param {string} name A unique state name, e.g. "home", "about", "contacts".
         */
        this.register = function (stateName, opts) {

            var params = angular.extend({
                delay:     0,
                scrollTop: 0
            }, opts || {});

            if (angular.isString(stateName)) {
                states[stateName] = params;
            }

            return this;
        };

        this.$get = [function () {
            return {
                states: states
            };
        }];
    }

}());
