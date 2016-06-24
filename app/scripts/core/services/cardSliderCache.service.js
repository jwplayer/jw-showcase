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
        .service('cardSliderCache', cardSliderCacheService);

    /**
     * @ngdoc service
     * @name app.core.cardSliderCache
     *
     * @requires $cacheFactory
     */
    cardSliderCacheService.$inject = ['$cacheFactory'];
    function cardSliderCacheService ($cacheFactory) {

        var cache = $cacheFactory('cardSliderState');

        return {
            'save': saveSliderState,
            'get':  getSliderState
        };

        /**
         * Saves slider state in $cacheFactory instance
         * @param {string} id       Unique identifier
         * @param {*}      state    State to store
         */
        function saveSliderState (id, state) {

            cache.put(id, state);
        }

        /**
         * Get slider state. If exists `callback` will be called with cached state.
         * @param {string}      id          Unique identifier
         * @param {function}    callback    Callback function
         */
        function getSliderState (id, callback) {

            var state = cache.get(id);

            if (!state) {
                return;
            }

            if (angular.isFunction(callback)) {
                callback(state);
            }
        }
    }

}());
