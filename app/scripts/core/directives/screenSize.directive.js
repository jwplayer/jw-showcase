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
        .directive('jwScreenSize', jwScreenSize);

    jwScreenSize.$inject = ['$animate', '$compile', '$parse', 'platform'];
    function jwScreenSize ($animate, $compile, $parse, platform) {
        return {
            multiElement: true,
            transclude:   'element',
            priority:     500,
            terminal:     true,
            restrict:     'A',
            $$tlb:        true,
            link:         link
        };

        function link ($scope, $element, $attr, ctrl, $transclude) {
            var block, childScope, previousElements;
            var screenSize   = platform.screenSize();
            var breakpoints  = $attr.jwScreenSize.replace(/ /g, '').split(',');
            var shouldRender = getShouldRender();

            activate();

            //////////////////

            /**
             * Initialize directive
             */
            function activate () {

                window.addEventListener('resize', resizeHandler);

                $scope.$on('$destroy', function () {
                    window.removeEventListener('resize', resizeHandler);
                });

                // initial update
                update();
            }

            /**
             * Returns true if the directive should render
             * @returns {boolean}
             */
            function getShouldRender () {

                var render = breakpoints.indexOf(screenSize) !== -1;

                if (!render && $attr.jwScreenSizeOr) {
                    render = $parse($attr.jwScreenSizeOr)($scope);
                }

                return render;
            }

            /**
             * Handle browser resize event
             */
            function resizeHandler () {
                var newScreenSize = platform.screenSize();
                var render;

                // only update if screenSize changes
                if (screenSize === newScreenSize) {
                    return;
                }

                screenSize = newScreenSize;
                render     = getShouldRender();

                if (render !== shouldRender) {
                    shouldRender = render;
                    update();
                    $scope.$digest();
                }
            }

            /**
             * Handle update when the shouldRender value changes
             */
            function update () {

                if (shouldRender) {
                    if (!childScope) {
                        $transclude(function (clone, newScope) {
                            childScope            = newScope;
                            clone[clone.length++] = $compile.$$createComment('end jwScreenSize', $attr.ngIf);
                            // Note: We only need the first/last node of the cloned nodes.
                            // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                            // by a directive with templateUrl when its template arrives.
                            block = {
                                clone: clone
                            };
                            $animate.enter(clone, $element.parent(), $element).then(function () {

                                // let the application know that the view has been updated
                                $scope.$emit('$viewContentUpdated');
                            });
                        });
                    }
                } else {
                    if (previousElements) {
                        previousElements.remove();
                        previousElements = null;
                    }
                    if (childScope) {
                        childScope.$destroy();
                        childScope = null;
                    }
                    if (block) {
                        previousElements = getBlockNodes(block.clone);
                        $animate.leave(previousElements).done(function (response) {
                            if (response !== false) {
                                previousElements = null;
                            }
                        });
                        block = null;
                    }
                }
            }
        }

        /**
         * Return the DOM siblings between the first and last node in the given array.
         * @param {Array} array like object
         * @returns {Array} the inputted object or a jqLite collection containing the nodes
         */
        function getBlockNodes (nodes) {
            // TODO(perf): update `nodes` instead of creating a new object?
            var node    = nodes[0];
            var endNode = nodes[nodes.length - 1];
            var blockNodes;

            for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
                if (blockNodes || nodes[i] !== node) {
                    if (!blockNodes) {
                        blockNodes = angular.element(Array.prototype.slice.call(nodes, 0, i));
                    }
                    blockNodes.push(node);
                }
            }

            return blockNodes || nodes;
        }
    }

})();


