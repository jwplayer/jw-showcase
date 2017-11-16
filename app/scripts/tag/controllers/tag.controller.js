/**
 * Copyright 2017 Longtail Ad Solutions Inc.
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
        .module('jwShowcase.tag')
        .controller('TagController', TagController);

    /**
     * @ngdoc controller
     * @name jwShowcase.tag.FeedController
     *
     * @requires $state
     * @requires jwShowcase.core.platform
     * @requires jwShowcase.core.utils
     * @requires jwShowcase.core.feed
     */
    TagController.$inject = ['$state', 'platform', 'utils', 'feed'];
    function TagController ($state, platform, utils, feed) {

        var vm = this;

        vm.feed             = feed;
        vm.cardClickHandler = cardClickHandler;

        ////////////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.tag.TagController#cardClickHandler
         * @methodOf jwShowcase.tag.TagController
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
