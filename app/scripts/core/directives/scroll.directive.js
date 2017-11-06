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
        .module('jwShowcase.core')
        .directive('jwScroll', scrollDirective);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwScrollDirective
     *
     * @example
     *
     * ```
     * <jw-scroll delegate="delegate">
     *     <ul>
     *         <li ng-repeat="item in items">{{ item }}</li>
     *     </ul>
     * </jw-scroll>
     * ```
     */

    scrollDirective.$inject = ['$timeout', 'platform'];
    function scrollDirective ($timeout, platform) {
        return {
            restrict:    'E',
            link:        link,
            transclude:  true,
            templateUrl: 'views/core/scroll.html',
            scope:       {
                delegate: '='
            }
        };

        function link (scope, element) {

            var scrollElement = angular.element(element[0].firstChild);
            var jsScrolling   = !platform.isMobile;
            var instance      = null;

            activate();

            ////////////

            /**
             * Initialize
             */
            function activate () {

                if (jsScrolling) {
                    $timeout(initializeIScroll);
                }

                scope.delegate = {
                    scrollTo: scrollTo,
                    refresh:  refresh
                };

                scope.$on('$destroy', destroyHandler);
            }

            /**
             * Handle destroy event
             */
            function destroyHandler () {

                if (instance) {
                    instance.destroy();

                    scrollElement.off('keyup', keyupEventHandler);
                    scrollElement.off('wheel', wheelEventHandler);
                    scrollElement.off('mousewheel', wheelEventHandler);
                    scrollElement.off('DOMMouseScroll', wheelEventHandler);
                }

                scope.delegate = null;
            }

            /**
             * Initialize iScroll plugin
             */
            function initializeIScroll () {

                instance = new window.IScroll(scrollElement[0], {
                    disableMouse:   true,
                    disablePointer: true,
                    mouseWheel:     true,
                    scrollbars:     'custom'
                });

                scrollElement.on('keyup', keyupEventHandler);
                scrollElement.on('wheel', wheelEventHandler);
                scrollElement.on('mousewheel', wheelEventHandler);
                scrollElement.on('DOMMouseScroll', wheelEventHandler);
            }

            /**
             * Handle wheel events
             * @param event
             */
            function wheelEventHandler (event) {

                if (!instance) {
                    return;
                }

                if (event.deltaY < 0 && instance.y === 0) {
                    instance.enabled = false;
                }
                else if (event.deltaY > 0 && instance.y <= instance.maxScrollY) {
                    instance.enabled = false;
                }
                else if (!instance.enabled) {

                    // re-enable iScroll. Call prevent default to prevent scrolling both parent and scroll element.
                    instance.enabled = true;
                    event.preventDefault();
                }
            }

            /**
             * Handle keyup event to restore scroll position while using the tab key to go through content
             * @param event
             */
            function keyupEventHandler (event) {

                // only listen to tab key
                if (event.which !== 9) {
                    return;
                }

                setTimeout(function () {
                    var oldScrollY = this.scrollTop,
                        oldScrollX = this.scrollLeft;

                    if (oldScrollY || oldScrollX) {
                        this.scrollTop  = 0;
                        this.scrollLeft = 0;
                        instance.scrollBy(-oldScrollX, -oldScrollY);
                    }
                    else {
                        instance.scrollToElement(document.activeElement);
                    }
                }, 0);
            }

            /**
             * Scroll to given position
             * @param x
             * @param y
             * @param duration
             */
            function scrollTo (x, y, duration) {

                if (jsScrolling) {
                    instance.scrollTo(x, y, duration);
                }
                else {
                    window.TweenLite.to(element[0].firstChild, 0.3, {
                        scrollTop: 0
                    });
                }
            }

            /**
             * Refresh scroll content
             */
            function refresh () {

                if (jsScrolling) {
                    instance.refresh();
                }
            }
        }
    }

}());
