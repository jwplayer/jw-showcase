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
        .module('jwShowcase.core')
        .controller('RootController', RootController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.RootController
     *
     * @requires $scope
     * @requires $timeout
     * @requires jwShowcase.core.dataStore
     * @requires jwShowcase.core.appStore
     * @requires jwShowcase.core.seo
     * @requires jwShowcase.core.serviceWorker
     * @requires jwShowcase.config
     */
    RootController.$inject = ['$scope', '$timeout', 'dataStore', 'appStore', 'seo', 'serviceWorker', 'config'];
    function RootController ($scope, $timeout, dataStore, appStore, seo, serviceWorker, config) {

        var rootVm = this;

        rootVm.seo       = seo;
        rootVm.dataStore = dataStore;
        rootVm.appStore  = appStore;
        rootVm.config    = config;
        rootVm.reconnect = reconnect;

        activate();

        ////////////////

        /**
         * Initialize controller
         */
        function activate () {

            seo.initialize();

            $scope.$on('$stateChangeSuccess', function () {
                $timeout(function () {
                    appStore.loading = false;
                }, 50);
            });
        }

        /**
         * Retry connection
         */
        function reconnect () {

            serviceWorker.updateConnectionState();
        }
    }

}());

