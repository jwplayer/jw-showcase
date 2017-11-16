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
        .module('jwShowcase.dashboard')
        .controller('DashboardController', DashboardController);

    /**
     * @ngdoc controller
     * @name jwShowcase.dashboard.DashboardController
     *
     * @requires $state
     * @requires jwShowcase.core.dataStore
     * @requires jwShowcase.core.platform
     */
    DashboardController.$inject = ['$state', 'dataStore', 'platform', 'utils', 'config'];

    function DashboardController ($state, dataStore, platform, utils, config) {

        var vm = this;

        vm.dataStore = dataStore;
        vm.config    = config;
        vm.rows      = [];

        vm.cardClickHandler = cardClickHandler;

        activate();

        ////////////

        /**
         * Initialize controller
         */
        function activate () {

            $state.history = [];

            vm.rows = config.content.map(function (options) {
                return {
                    options: options,
                    feed:    dataStore.getFeed(options.playlistId)
                };
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.dashboard.DashboardController#cardClickHandler
         * @methodOf jwShowcase.dashboard.DashboardController
         *
         * @description
         * Handle click event on the card.
         *
         * @param {jwShowcase.core.item}    item            Clicked item
         * @param {boolean}                 clickedOnPlay   Did the user clicked on the play button
         */
        function cardClickHandler (item, clickedOnPlay) {

            $state.go('root.video', {
                list:      item.feedid,
                mediaId:   item.mediaid,
                slug:      utils.slugify(item.title),
                autoStart: clickedOnPlay || platform.isMobile
            });
        }
    }

}());
