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

    /**
     * @ngdoc component
     * @name jwVideoDetailsShare
     * @module jwShowcase.video
     *
     * @description
     *
     * # jwVideoDetails
     * Render video details share component.
     *
     * @example
     *
     * ```html
     * <jw-video-details-share></jw-video-details-title>
     * ```
     */
    angular
        .module('jwShowcase.video')
        .component('jwVideoDetailsShare', {
            templateUrl:  'views/video/videoDetailsShare.html',
            controller:   VideoDetailsShareController,
            controllerAs: 'vm',
            transclude:   true,
            require:      {
                jwVideoDetails: '^'
            }
        });

    VideoDetailsShareController.$inject = ['$scope', 'utils'];
    function VideoDetailsShareController ($scope, utils) {

        var vm = this;

        vm.facebookShareLink = '';
        vm.twitterShareLink  = '';
        vm.emailShareLink    = '';

        $scope.$watch('vm.jwVideoDetails.item', function (item) {
            vm.facebookShareLink = utils.composeFacebookLink();
            vm.twitterShareLink  = utils.composeTwitterLink(item.title);
            vm.emailShareLink    = utils.composeEmailLink(item.title);
        });
    }

}());

