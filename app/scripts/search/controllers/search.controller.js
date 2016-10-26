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
        .module('app.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state', 'dataStore', 'appStore'];
    function SearchController ($scope, $state, dataStore, appStore) {

        var vm = this;

        vm.feed = dataStore.searchFeed;

        vm.cardClickHandler = cardClickHandler;

        activate();

        ////////////////////////

        /**
         * Initialize controller
         */
        function activate () {

            // disable searchBar when leaving this view
            $scope.$on('$ionicView.beforeLeave', function () {
                appStore.searchBarActive = false;
            });

            // enable searchBar when entering this view
            $scope.$on('$ionicView.beforeEnter', function () {
                appStore.searchBarActive = true;
            });
        }

        /**
         * Handle click event on cards
         *
         * @param {app.core.item}   item        Clicked item
         * @param {boolean}         autoStart   Should the video playback start automatically
         */
        function cardClickHandler (item, autoStart) {

            $state.go('root.video', {
                feedId:    item.feedid,
                mediaId:   item.mediaid,
                autoStart: autoStart
            });
        }
    }

})();

