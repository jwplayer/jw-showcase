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

    var mobileQuery  = window.matchMedia('(max-width: 767px)'),
        tabletQuery  = window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
        desktopQuery = window.matchMedia('(min-width: 1024px)');

    angular
        .module('jwShowcase.core')
        .factory('platform', platform);

    platform.$inject = [];

    function platform () {

        var isTouch  = 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch),
            parser   = new window.UAParser(),
            result   = parser.getResult(),
            osName   = (result.os.name || '').toLowerCase(),
            isMobile = ['android', 'ios'].indexOf(osName) > -1;

        return {
            prepare:         prepare,
            screenSize:      getScreenSize,
            isTouch:         isTouch,
            isAndroid:       osName === 'android',
            isIOS:           osName === 'ios',
            isWindows:       osName === 'windows',
            isMobile:        isMobile,
            isPrerender:     /prerender/i.test(navigator.userAgent),
            browserName:     result.browser.name,
            browserVersion:  result.browser.version,
            platformName:    result.os.name,
            platformVersion: result.os.version
        };

        function prepare () {

            var body = angular.element(document.body);

            if (true === isTouch) {
                body.addClass('jw-flag-touch');
            }

            if (osName === 'android') {
                var androidVersion = result.os.version.substr(0, result.os.version.indexOf('.'));

                body.addClass('jw-flag-android');
                body.addClass('jw-flag-android-' + androidVersion);
            }

            if (osName === 'ios') {
                body.addClass('jw-flag-ios');
            }

            if (isMobile) {
                body.addClass('jw-flag-mobile');
            }
        }

        function getScreenSize () {

            if (mobileQuery.matches) {
                return 'mobile';
            }
            if (tabletQuery.matches) {
                return 'tablet';
            }
            if (desktopQuery.matches) {
                return 'desktop';
            }
        }
    }

}());
