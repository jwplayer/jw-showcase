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
        .controller('ShareController', ShareController);

    ShareController.$inject = ['$timeout', '$location', 'utils', 'item'];
    function ShareController ($timeout, $location, utils, item) {

        var vm = this;

        vm.facebookShareLink = composeFacebookLink();
        vm.twitterShareLink  = composeTwitterLink();
        vm.emailShareLink    = composeEmailLink();
        vm.copyResult        = null;

        vm.copyUrl = copyUrl;

        ////////////////

        /**
         * Copy current url to clipboard
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


        /**
         * Compose a Facebook share link with the current URL
         *
         * @returns {string}
         */
        function composeFacebookLink () {

            var facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?p[url]={url}';

            return facebookShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()));
        }

        /**
         * Compose a Twitter share link with the current URL and title
         *
         * @returns {string}
         */
        function composeTwitterLink () {

            var twitterShareLink = 'http://twitter.com/share?text={text}&amp;url={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()))
                .replace('{text}', encodeURIComponent(item.title));
        }

        /**
         * Compose a Email share link with the current URL and title
         *
         * @returns {string}
         */
        function composeEmailLink () {

            var twitterShareLink = 'mailto:?subject={subject}&body={url}';

            return twitterShareLink
                .replace('{url}', encodeURIComponent($location.absUrl()))
                .replace('{subject}', encodeURIComponent(item.title));
        }
    }

}());