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

    /**
     * @ngdoc component
     * @name jwSearch
     * @module jwShowcase.core
     *
     * @description
     * Render the search element.
     *
     * @example
     *
     * ```html
     * <jw-search></jw-search>
     * ```
     */
    angular
        .module('jwShowcase.core')
        .component('jwSearch', {
            controllerAs: 'vm',
            controller:   SearchController,
            templateUrl:  'views/core/search.html'
        });

    /**
     * @ngdoc controller
     * @name jwShowcase.core.SearchController
     *
     * @requires jwShowcase.config
     */
    SearchController.$inject = ['$rootScope', '$state', 'config', 'utils'];

    function SearchController ($rootScope, $state, config, utils) {

        var vm = this;

        vm.config = config;

        vm.searchPhrase       = '';
        vm.searchBarActive    = false;
        vm.showCaptionMatches = false;

        vm.closeSearchButtonClickHandler   = closeSearchButtonClickHandler;
        vm.searchButtonClickHandler        = searchButtonClickHandler;
        vm.searchInputKeyupHandler         = searchInputKeyupHandler;
        vm.searchInputChangeHandler        = searchInputChangeHandler;
        vm.showCaptionMatchesChangeHandler = showCaptionMatchesChangeHandler;

        vm.$onInit = activate;

        //////////////////

        /**
         * Initialize controller
         */
        function activate () {

            $rootScope.$on('$stateChangeSuccess', stateChangeSuccessHandler);
        }

        /**
         * Handle $stateChangeSuccess event
         *
         * @param event
         * @param toState
         * @param toParams
         */
        function stateChangeSuccessHandler (event, toState, toParams) {

            // disable and clear searchBar when navigating to a state other than root.search.
            if ('root.search' !== toState.name) {
                vm.searchPhrase    = '';
                vm.searchBarActive = false;
                return;
            }

            // use search query parameter, but only when searchPhrase is empty.
            if (!vm.searchPhrase) {
                vm.searchPhrase = toParams.query.replace(/\+/g, ' ');
            }

            // enable searchBar
            vm.searchBarActive    = true;
            vm.showCaptionMatches = toParams.showCaptionMatches;
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.SearchController#closeSearchButtonClickHandler
         * @methodOf jwShowcase.core.SearchController
         *
         * @description
         * Handle click on the close search button.
         */
        function closeSearchButtonClickHandler () {

            vm.searchBarActive = false;
            vm.searchPhrase    = '';
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.SearchController#searchButtonClickHandler
         * @methodOf jwShowcase.core.SearchController
         *
         * @description
         * Handle click on the search button.
         */
        function searchButtonClickHandler () {

            vm.searchBarActive = true;

            setTimeout(function () {
                document.querySelector('.jw-search-input').focus();
            }, 300);
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.SearchController#searchInputKeyupHandler
         * @methodOf jwShowcase.core.SearchController
         *
         * @description
         * Handle keyup event on the search input element.
         */
        function searchInputKeyupHandler (event) {

            // esc
            if (27 === event.which) {

                vm.searchPhrase    = '';
                vm.searchBarActive = false;
            }

            // enter
            if (13 === event.which) {

                searchAndDisplayResults();
            }
        }

        /**
         * @ngdoc method
         * @name jwShowcase.core.SearchController#searchInputChangeHandler
         * @methodOf jwShowcase.core.SearchController
         *
         * @description
         * Handle change event on the search input element.
         */
        function searchInputChangeHandler () {

            searchAndDisplayResults();
        }

        /**
         * Get search results and go to search state
         */
        function searchAndDisplayResults () {

            $state.go('root.search', {
                query:              utils.slugify(vm.searchPhrase, '+'),
                showCaptionMatches: vm.showCaptionMatches
            });
        }

        /**
         *  Handle search in captions toggle change
         */
        function showCaptionMatchesChangeHandler () {

            // prevent navigating to search state when search phrase is empty.
            if (vm.searchPhrase === '') {
                return;
            }

            searchAndDisplayResults();
        }
    }

}());
