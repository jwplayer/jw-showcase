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

    var SEO_PROPERTIES = ['title', 'description', 'image'];

    angular
        .module('app.core')
        .provider('seo', SeoProvider);

    /**
     * @ngdoc service
     * @name app.core.seoProvider
     *
     * @description
     * Small service to change title and meta tags based on ui.router state.
     */
    SeoProvider.$inject = [];
    function SeoProvider () {

        var states    = [],
            otherwise = {};

        this.state     = addState;
        this.otherwise = setOtherwise;

        this.$get = ['$rootScope', '$state', '$injector', Seo];

        //////////

        /**
         * @ngdoc function
         * @name app.core.seoProvider#state
         * @methodOf app.core.seoProvider
         *
         * @description
         * Add state with metadata which will be used when the ui.router state changes.
         *
         * @param {string}                  stateName   State name
         * @param {Object|Array|function}   metadata    Object with static metadata or Array|Function which will be
         *                                              invoked by `ngInjector#invoke`.
         *
         * @return {app.core.seoProvider} seoProvider instance
         */

        function addState (stateName, metadata) {

            states.push({
                name:     stateName,
                metadata: metadata
            });

            return this;
        }

        /**
         * @ngdoc function
         * @name app.core.seoProvider#setOtherwise
         * @methodOf app.core.seoProvider
         *
         * @description
         * Add metadata when no registered state matches the current ui.router state.
         *
         * @param {Object|Array|function}   metadata    Object with static metadata or Array|Function which will be
         *                                              invoked by `ngInjector#invoke`.
         *
         * @return {app.core.seoProvider} seoProvider instance
         */

        function setOtherwise (metadata) {

            otherwise = {
                metadata: metadata
            };

            return this;
        }

        /**
         * @ngdoc service
         * @name app.core.seo
         *
         * @description
         * Seo service
         *
         * @property {Object} metadata Object with composed metadata values.
         *
         * @requires $rootScope
         * @requires $state
         * @requires $injector
         */

        function Seo ($rootScope, $state, $injector) {

            var service = {
                metadata:   {},
                initialize: initialize
            };

            return service;

            /**
             * @ngdoc function
             * @name app.core.seo#initialize
             * @methodOf app.core.seo
             *
             * @description
             * Initialize the seo service to listen for $stateChangeSuccess events and update to the current state
             * immediately.
             */
            function initialize () {

                $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                    updateMetadata(toState.name);
                });

                updateMetadata($state.current.name);
            }

            /**
             * Update metadata when the state changes.
             *
             * @param {String} stateName New stateName
             */
            function updateMetadata (stateName) {

                var toState  = states
                            .filter(function (state) {
                                return state.name === stateName;
                            })[0] || otherwise,
                    metadata = toState.metadata;

                // clean metadata
                service.metadata = {};

                if (!toState) {
                    return;
                }

                if (angular.isFunction(metadata) || angular.isArray(metadata)) {
                    metadata = $injector.invoke(metadata);
                }

                angular.forEach(SEO_PROPERTIES, function (property) {

                    var value = metadata[property] || '';

                    service.metadata[property] = value;

                    switch (property) {
                    case 'title':
                        updateTitle(value);
                        updateFBMetaContent('title', value);
                        break;
                    case 'description':
                        updateFBMetaContent('description', value);
                        updateMetaContent('description', value);
                        break;
                    case 'image':
                        updateFBMetaContent('image', value);
                        break;
                    }
                });
            }

            /**
             * Update page title
             *
             * @param {string} title The new document title
             */
            function updateTitle (title) {

                document.title = title;
            }

            /**
             * Update meta tag by name attribute
             *
             * @param {string} name     The name attribute of the meta tag
             * @param {string} content  The new content value
             */
            function updateMetaContent (name, content) {

                document.querySelector('meta[name=' + name + ']').content = content;
            }

            /**
             * Update meta tag by property attribute. The property is prefixed with `og:` before the search query.
             *
             * @param {string} property The property attribute
             * @param content  content  The new content value
             */
            function updateFBMetaContent (property, content) {

                document.querySelector('meta[property="og:' + property + '"]').content = content;
            }
        }
    }

}());
