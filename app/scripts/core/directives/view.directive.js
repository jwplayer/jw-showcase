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
        .directive('jwView', $ViewDirective)
        .directive('jwView', $ViewDirectiveFill);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwView
     *
     * @requires ui.router.state.$state
     * @requires $compile
     * @requires $controller
     * @requires $injector
     * @requires ui.router.state.$uiViewScroll
     * @requires $document
     *
     * @restrict ECA
     *
     * @description
     * This is mostly the ui-view directive. Added is the view caching mechanism from
     * {@link https://github.com/angular-ui/ui-router/pull/2333}
     *
     * @param {string=} name A view name. The name should be unique amongst the other views in the
     * same state. You can have views of the same name that live in different states.
     *
     * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
     * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
     * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
     * scroll ui-view elements into view when they are populated during a state activation.
     *
     * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
     * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
     *
     * @param {string=} onload Expression to evaluate whenever the view updates.
     *
     */

    $ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate', '$q'];
    function $ViewDirective ($state, $injector, $uiViewScroll, $interpolate, $q) {

        function getService () {
            return ($injector.has) ? function (service) {
                    return $injector.has(service) ? $injector.get(service) : null;
                } : function (service) {
                    try {
                        return $injector.get(service);
                    } catch (e) {
                        return null;
                    }
                };
        }

        var service   = getService(),
            $animator = service('$animator'),
            $animate  = service('$animate');

        // Returns a set of DOM manipulation functions based on which Angular version
        // it should use
        function getRenderer (attrs, scope) {
            var statics = function () {
                return {
                    enter: function (element, target, cb) {
                        target.after(element);
                        cb();
                    },
                    leave: function (element, cb) {
                        element.remove();
                        cb();
                    }
                };
            };

            if ($animate) {
                return {
                    enter: function (element, target, cb) {
                        if (angular.version.minor > 2) {
                            $animate.enter(element, null, target).then(cb);
                        } else {
                            $animate.enter(element, null, target, cb);
                        }
                    },
                    leave: function (element, cb) {
                        if (angular.version.minor > 2) {
                            $animate.leave(element).then(cb);
                        } else {
                            $animate.leave(element, cb);
                        }
                    }
                };
            }

            if ($animator) {
                var animate = $animator && $animator(scope, attrs);

                return {
                    enter: function (element, target, cb) {
                        animate.enter(element, null, target);
                        cb();
                    },
                    leave: function (element, cb) {
                        animate.leave(element);
                        cb();
                    }
                };
            }

            return statics();
        }

        return {
            restrict:   'ECA',
            terminal:   true,
            priority:   400,
            transclude: 'element',
            compile:    function (tElement, tAttrs, $transclude) {
                return function (scope, $element, attrs) {
                    var previousEl, currentEl, currentScope, latestLocals,
                        onloadExp     = attrs.onload || '',
                        autoScrollExp = attrs.autoscroll,
                        renderer      = getRenderer(attrs, scope),
                        inherited     = $element.inheritedData('$uiView');

                    scope.$on('$stateChangeSuccess', function () {
                        updateView(false);
                    });

                    updateView(true);

                    function cleanupLastView () {
                        var persistent = currentScope && currentScope.$persistent;

                        if (previousEl) {
                            previousEl = null;
                        }

                        if (currentScope && !persistent) {
                            currentScope.$destroy();
                            currentScope = null;
                        }

                        if (currentEl) {

                            if (persistent) {
                                currentEl.detach();
                            } else {
                                var $uiViewData = currentEl.data('$uiViewAnim');
                                renderer.leave(currentEl, function () {
                                    $uiViewData.$$animLeave.resolve();
                                    previousEl = null;
                                });
                            }
                            previousEl = currentEl;
                            currentEl  = null;
                        }
                    }

                    function restoreFromCache (name, cached) {

                        renderer.enter(cached.element, $element, function () {

                            /**
                             * @ngdoc event
                             * @name ui.router.state.directive:ui-view#$viewRestored
                             * @eventOf ui.router.state.directive:ui-view
                             * @eventType emits on ui-view directive scope
                             * @description
                             * Fired once view is restored (only when persistent flag is set to true)
                             * @param {Object} event Event object.
                             * @param {Object} data, object with view name.
                             */
                            cached.scope.$broadcast('$viewRestored', {name: name});
                        });

                        currentEl    = cached.element;
                        currentScope = cached.scope;
                    }

                    function updateView (firstTime) {
                        var newScope,
                            name           = getUiViewName(scope, attrs, $element, $interpolate),
                            previousLocals = name && $state.$current && $state.$current.locals[name];

                        if (!firstTime && previousLocals === latestLocals) {
                            return; // nothing to do
                        }

                        latestLocals = $state.$current.locals[name];

                        var cached = $state.$current.persistent && $state.$current.viewCache &&
                            $state.$current.viewCache[name];

                        if (cached && angular.equals(cached.params, $state.params)) {
                            cleanupLastView();
                            restoreFromCache(name, cached);
                            return;
                        }

                        newScope = scope.$new();

                        /**
                         * @ngdoc event
                         * @name ui.router.state.directive:ui-view#$viewContentLoading
                         * @eventOf ui.router.state.directive:ui-view
                         * @eventType emits on ui-view directive scope
                         * @description
                         *
                         * Fired once the view **begins loading**, *before* the DOM is rendered.
                         *
                         * @param {Object} event Event object.
                         * @param {string} viewName Name of the view.
                         */
                        newScope.$emit('$viewContentLoading', name);

                        var clone = $transclude(newScope, function (clone) {
                            var cached;
                            var animEnter    = $q.defer(), animLeave = $q.defer();
                            var viewAnimData = {
                                $animEnter:  animEnter.promise,
                                $animLeave:  animLeave.promise,
                                $$animLeave: animLeave
                            };

                            clone.data('$uiViewAnim', viewAnimData);
                            renderer.enter(clone, $element, function onUiViewEnter () {
                                animEnter.resolve();
                                if (currentScope) {
                                    currentScope.$emit('$viewContentAnimationEnded');
                                }

                                if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                                    $uiViewScroll(clone);
                                }

                                // when controller is compiled
                                if (cached) {
                                    /**
                                     * @ngdoc event
                                     * @name ui.router.state.directive:ui-view#$viewCached
                                     * @eventOf ui.router.state.directive:ui-view
                                     * @eventType emits on ui-view directive scope
                                     * @description
                                     * Fired once view is cached (only when persistent flag is set to true)
                                     * @param {Object} event Event object.
                                     * @param {Object} data, object with view name and reset function (clears cache
                                     * for this view)
                                     */
                                    var tmp = $state.$current;
                                    cached.scope.$emit('$viewCached', {
                                        name:  name,
                                        reset: function () {
                                            delete tmp.viewCache[name];
                                        }
                                    });
                                }
                            });

                            // caching of persistent states
                            if ($state.$current.persistent) {
                                if (!$state.$current.viewCache) {
                                    $state.$current.viewCache = {};
                                }
                                cached                          = {
                                    element:   clone,
                                    params:    angular.extend({}, $state.params),
                                    scope:     newScope
                                };
                                cached.scope.$persistent        = true;
                                $state.$current.viewCache[name] = cached;
                            }
                            cleanupLastView();
                        });

                        currentEl    = clone;
                        currentScope = newScope;
                        /**
                         * @ngdoc event
                         * @name ui.router.state.directive:ui-view#$viewContentLoaded
                         * @eventOf ui.router.state.directive:ui-view
                         * @eventType emits on ui-view directive scope
                         * @description
                         * Fired once the view is **loaded**, *after* the DOM is rendered.
                         *
                         * @param {Object} event Event object.
                         * @param {string} viewName Name of the view.
                         */
                        currentScope.$emit('$viewContentLoaded', name);
                        currentScope.$eval(onloadExp);
                    }
                };
            }
        };
    }

    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
    function $ViewDirectiveFill ($compile, $controller, $state, $interpolate) {
        return {
            restrict: 'ECA',
            priority: -400,
            compile:  function (tElement) {
                var initial = tElement.html();
                return function (scope, $element, attrs) {
                    var current = $state.$current,
                        name    = getUiViewName(scope, attrs, $element, $interpolate),
                        locals  = current && current.locals[name];

                    if (!locals) {
                        return;
                    }

                    $element.data('$uiView', {name: name, state: locals.$$state});
                    $element.html(locals.$template ? locals.$template : initial);

                    var resolveData           = angular.extend({}, locals);
                    scope[locals.$$resolveAs] = resolveData;

                    var link = $compile($element.contents());

                    if (locals.$$controller) {
                        locals.$scope   = scope;
                        locals.$element = $element;
                        var controller  = $controller(locals.$$controller, locals);
                        if (locals.$$controllerAs) {
                            scope[locals.$$controllerAs]                     = controller;
                            scope[locals.$$controllerAs][locals.$$resolveAs] = resolveData;
                        }
                        if (angular.isFunction(controller.$onInit)) {
                            controller.$onInit();
                        }
                        $element.data('$ngControllerController', controller);
                        $element.children().data('$ngControllerController', controller);
                    }

                    link(scope);
                };
            }
        };
    }

    /**
     * Shared ui-view code for both directives:
     * Given scope, element, and its attributes, return the view's name
     */
    function getUiViewName (scope, attrs, element, $interpolate) {
        var name            = $interpolate(attrs.uiView || attrs.name || '')(scope);
        var uiViewCreatedBy = element.inheritedData('$uiView');
        return name.indexOf('@') >= 0 ? name : (name + '@' + (uiViewCreatedBy ? uiViewCreatedBy.state.name : ''));
    }

}());
