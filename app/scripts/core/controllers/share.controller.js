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
        .controller('ShareController', ShareController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.ShareController
     *
     * @requires $timeout
     * @requires $location
     * @requires jwShowcase.core.utils
     */
    ShareController.$inject = ['$timeout', '$location', 'utils', 'item'];
    function ShareController ($timeout, $location, utils, item) {

        var vm = this;

        vm.facebookShareLink = utils.composeFacebookLink();
        vm.twitterShareLink  = utils.composeTwitterLink(item.title);
        vm.emailShareLink    = utils.composeEmailLink(item.title);
        vm.copyResult        = null;

        vm.copyUrl = copyUrl;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.ShareController#copyUrl
         * @methodOf jwShowcase.core.ShareController
         *
         * @description
         * Copies current absolute URL to user's clipboard.
         */
        function copyUrl () {

            if (utils.copyToClipboard($location.absUrl())) {
                vm.copyResult = {text: 'Link copied', success: true};
            }
            else {
                vm.copyResult = {text: 'Failed to copy', success: false};
            }

            $timeout(function () {
                vm.copyResult = null;
            }, 2000);
        }
    }

}());
