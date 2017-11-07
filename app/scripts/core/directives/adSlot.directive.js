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
        .directive('jwAdSlot', jwAdSlot);

    jwAdSlot.$inject = ['config', 'dfp', 'utils', 'platform'];

    function jwAdSlot (config, dfp, utils, platform) {
        return {
            bindToController: true,
            controller:       angular.noop,
            controllerAs:     'vm',
            link:             link,
            restrict:         'E',
            replace:          true,
            template:         '<div class="jw-ad-slot"></div>',
            scope:            {
                slotId:          '@',
                slotSize:        '=',
                slotSizeMapping: '='
            }
        };

        function link (scope, element, attrs) {

            var screenSize = platform.screenSize();

            activate();

            ///////////

            /**
             * Initialize directive
             */
            function activate () {

                var resizeDebounced = utils.debounce(resize, 10);
                var adUnit;

                if (config.options.displayAds && config.options.displayAds.slots) {
                    adUnit = config.options.displayAds.slots[attrs.slotId];
                }

                if (!adUnit) {
                    element.css('display', 'none');
                    return;
                }

                element.attr('id', attrs.slotId);
                window.addEventListener('resize', resizeDebounced);

                // register slot
                dfp.registerSlot(adUnit, scope.vm.slotSize, attrs.slotId, scope.vm.slotSizeMapping);

                // display ad
                dfp.display(attrs.slotId);

                // destroy ad when scope is being destroyed
                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', resizeDebounced);
                    dfp.destroy(attrs.slotId);
                });

                // refresh adunit when the view is restored from cache
                scope.$on('$viewRestored', function () {
                    dfp.refresh(attrs.slotId);
                });
            }

            /**
             * Resize handler
             */
            function resize () {

                var newScreenSize = platform.screenSize();

                // only refresh when screenSize changes
                if (screenSize !== newScreenSize) {
                    screenSize = newScreenSize;
                    dfp.refresh(attrs.slotId);
                }
            }
        }
    }

}());
