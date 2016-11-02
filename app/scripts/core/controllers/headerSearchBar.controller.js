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

    angular
        .module('app.core')
        .controller('HeaderSearchBarController', HeaderSearchBarController);

    /**
     * @ngdoc controller
     * @name app.core.controller:HeaderBackButtonController
     *
     * @requires $state
     * @requires app.core.appStore
     * @requires app.core.apiConsumer
     */

    HeaderSearchBarController.$inject = ['$state', 'appStore', 'apiConsumer'];
    function HeaderSearchBarController ($state, appStore, apiConsumer) {

        var vm = this;

        vm.appStore = appStore;

        vm.closeSearchButtonClickHandler = closeSearchButtonClickHandler;
        vm.searchInputChangeHandler      = searchInputChangeHandler;
        vm.searchInputKeyupHandler       = searchInputKeyupHandler;

        ////////////////

        /**
         * Handle click event on closeSearch button
         */
        function closeSearchButtonClickHandler () {

            appStore.searchBarActive = false;
        }

        /**
         * Handle change event on search input
         */
        function searchInputChangeHandler () {

            searchAndDisplayResults();
        }

        /**
         * Handle keyup event on search input
         */
        function searchInputKeyupHandler ($event) {

            // esc
            if (27 === $event.which) {

                appStore.searchPhrase    = '';
                appStore.searchBarActive = false;
            }

            // enter
            if (13 === $event.which) {

                searchAndDisplayResults();
            }
        }

        /**
         * Get search results and go to search state
         */
        function searchAndDisplayResults () {

            apiConsumer
                .search(appStore.searchPhrase)
                .then(function () {

                    if ($state.$current.name !== 'root.search') {
                        $state.go('root.search');
                    }
                });
        }
    }

})();
