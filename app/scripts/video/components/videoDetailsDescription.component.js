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
     * @name jwVideoDetailsDescription
     * @module jwShowcase.video
     *
     * @description
     *
     * # jwVideoDetails
     * Render video details description component.
     *
     * @example
     *
     * ```html
     * <jw-video-details-description item="item"></jw-video-details-description>
     * ```
     */
    angular
        .module('jwShowcase.video')
        .component('jwVideoDetailsDescription', {
            templateUrl:  'views/video/videoDetailsDescription.html',
            controller:   angular.noop,
            controllerAs: 'vm',
            transclude:   true,
            require: {
                jwVideoDetails: '^'
            },
            bindings:     {
                enableTags: '<'
            }
        });

}());

