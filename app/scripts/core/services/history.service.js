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
        .provider('history', HistoryProvider);

    HistoryProvider.$inject = [];
    function HistoryProvider () {

        var defaultState = '';

        this.setDefaultState = function (state) {
            defaultState = state;
        };

        this.$get = History;

        History.$inject = ['$rootScope', '$state', '$location'];
        function History ($rootScope, $state, $location) {

            var self      = this;
            var goingBack = false;

            this.history = [];

            this.attach    = attach;
            this.goToIndex = goToIndex;
            this.goBack    = goBack;

            //////////////

            function attach () {

                var fromUrl;

                $rootScope.$on('$stateChangeStart', function () {
                    fromUrl = $location.url();
                });

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                    var historyIndex;

                    if (fromState.abstract) {
                        return;
                    }

                    historyIndex = self.history.findIndex(function (curr) {
                        return fromUrl === curr[0];
                    });

                    if (historyIndex > -1) {
                        self.history.splice(0, historyIndex);
                        goingBack = false;
                        return;
                    }

                    if (goingBack) {
                        goingBack = false;
                        return;
                    }

                    // update last history entry when history is set to false
                    if (false === fromState.history && self.history.length && self.history[0][1] === fromState.name) {
                        self.history[0][0] = fromUrl;
                        self.history[0][2] = angular.copy(fromParams);
                        return;
                    }

                    add(fromUrl, fromState.name, angular.copy(fromParams));
                });
            }

            /**
             * Add state to history
             * @param {string} url
             * @param {string} name
             * @param {Object} params
             */
            function add (url, name, params) {

                self.history.unshift([url, name, params]);
                self.history.splice(15);
            }

            /**
             * Go to state in history
             * @param {number} index
             */
            function goToIndex (index) {

                var item = self.history[index];

                if (item) {
                    goingBack = true;
                    $state.go(item[1], item[2]);
                    self.history.splice(0, index + 1);
                }
            }

            /**
             * Go back to the previous state
             */
            function goBack () {

                var history = self.history;

                // fallback to defaultState and clear history
                if (!history.length) {
                    self.history = [];
                    goingBack    = true;
                    $state.go(defaultState);
                    return;
                }

                self.goToIndex(0);
            }

            return this;
        }
    }

}());
