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

    var LARGE_SCREEN = window.matchMedia('(min-device-width: 960px)').matches;

    angular
        .module('app.core')
        .filter('jwImage', jwImage);

    /**
     * @ngdoc filter
     * @name app.core.filter:jwImage
     *
     * @description
     * Replace size flag to 1920 in the given image URL when if size is larger than 960 pixels.
     *
     * @example
     *
     * ```
     * <img ng-src="{{ imageUrl | jwImage }}" />
     * ```
     *
     * ```
     * app.controller('MyController', function ($scope, $filter) {
     *   $scope.imageUrl = $filter('jwImage')($scope.imageUrl);
     * });
     * ```
     */

    function jwImage () {
        
        return filter;

        ////////////////

        function filter (imageUrl) {

            // replace 720 to 1920 if LARGE_SCREEN constant is true
            if (true === LARGE_SCREEN && angular.isString(imageUrl)) {
                return imageUrl.replace(/720\.jpg/, '1920.jpg');
            }

            return imageUrl;
        }
    }

})();
