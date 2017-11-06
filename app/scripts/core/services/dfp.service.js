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

window.googletag = window.googletag || {};
window.googletag.cmd = window.googletag.cmd || [];

(function () {

    angular
        .module('jwShowcase.core')
        .service('dfp', dfp);

    /**
     * @ngdoc service
     * @name jwShowcase.core.dfp
     */
    dfp.$inject = ['$q'];

    function dfp ($q) {

        var gptScript    = 'https://www.googletagservices.com/tag/js/gpt.js',
            gptDefer     = $q.defer(),
            gptPromise   = gptDefer.promise,
            gptSetup     = false,
            dfp          = this,
            definedSlots = {};

        this.registerSlot = registerSlot;
        this.getSlot      = getSlot;
        this.display      = display;
        this.setup        = setup;
        this.refresh      = refresh;
        this.destroy      = destroy;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#registerSlot
         * @methodOf jwShowcase.core.dfp
         *
         * @returns {jwShowcase.core.dfp}
         */
        function registerSlot (adUnit, size, id, sizeMapping) {

            if (sizeMapping) {
                // to match css mediaQueries with sizeMapping breakpoints the scrollbar width must be subtracted.
                var scrollbarWidth = window.innerWidth - document.body.clientWidth;

                // but only when scrollbar is visible
                if (scrollbarWidth > 0) {
                    sizeMapping = sizeMapping.map(function (size) {
                        if (size[0][0] > 0) {
                            size[0][0] = size[0][0] - scrollbarWidth;
                        }
                        return size;
                    });
                }
            }

            googletag.cmd.push(function () {
                var slot = googletag.defineSlot(adUnit, size, id);

                if (sizeMapping) {
                    slot.defineSizeMapping(sizeMapping);
                }
                slot.addService(googletag.pubads());
                definedSlots[id] = slot;
            });

            return this;
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#display
         * @methodOf jwShowcase.core.dfp
         */
        function display (id) {
            gptPromise.then(function () {
                googletag.cmd.push(function () {
                    googletag.display(id);
                });
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#getSlot
         * @methodOf jwShowcase.core.dfp
         *
         * @returns {Object|undefined}
         */
        function getSlot (id) {

            return definedSlots[id];
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#refresh
         * @methodOf jwShowcase.core.dfp
         */
        function refresh (id) {

            if (!definedSlots[id]) {
                return;
            }

            googletag.cmd.push(function () {
                googletag.pubads().refresh([definedSlots[id]]);
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#display
         * @methodOf jwShowcase.core.dfp
         */
        function destroy (id) {

            if (!definedSlots[id]) {
                return;
            }

            googletag.cmd.push(function () {
                googletag.destroySlots([definedSlots[id]]);
            });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.dfp#setup
         * @methodOf jwShowcase.core.dfp
         */
        function setup () {

            return loadDfpScript().then(function () {
                googletag.cmd.push(function () {
                    googletag.pubads().collapseEmptyDivs(true);
                    googletag.pubads().setCentering(true);
                    googletag.enableServices();
                });
            });
        }

        /**
         * Load DFP script
         */
        function loadDfpScript () {

            var script;

            if (gptSetup) {
                return gptPromise;
            }

            gptSetup = true;

            script      = document.createElement('script');
            script.type = 'text/javascript';

            script.onload = function () {
                gptDefer.resolve();
            };

            script.onerror = function () {
                gptDefer.reject('Could not load dfp library, ad blocker?');
            };

            script.async = true;
            script.src   = gptScript;
            document.body.appendChild(script);

            return gptPromise;
        }
    }

}());
