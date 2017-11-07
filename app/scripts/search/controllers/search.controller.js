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
        .module('jwShowcase.search')
        .controller('SearchController', SearchController);

    /**
     * @ngdoc controller
     * @name jwShowcase.search.SearchController
     */
    SearchController.$inject = ['$state', 'platform', 'utils', 'searchFeed'];

    function SearchController ($state, platform, utils, searchFeed) {

        var vm = this;

        vm.cardClickHandler = cardClickHandler;
        vm.feed             = searchFeed;

        ////////////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.search.SearchController#cardClickHandler
         * @methodOf jwShowcase.search.SearchController
         *
         * @description
         * Handle click event on the card.
         *
         * @param {jwShowcase.core.item}    item            Clicked item
         * @param {boolean}                 clickedOnPlay   Did the user clicked on the play button
         * @param {number}                  [startTime]     Time to seek to once the video starts
         */
        function cardClickHandler (item, clickedOnPlay, startTime) {
            $state.go('root.video', {
                mediaId:   item.mediaid,
                slug:      utils.slugify(item.title),
                startTime: startTime,
                autoStart: clickedOnPlay || platform.isMobile || typeof startTime !== 'undefined'
            });
        }
    }

}());
