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
        .directive('jwHeaderBackButton', headerBackButtonDirective);

    /**
     * @ngdoc directive
     * @name jwHeaderBackButton
     * @module app.core
     * @restrict E
     */

    headerBackButtonDirective.$inject = ['$state', '$ionicHistory', '$ionicViewSwitcher'];
    function headerBackButtonDirective ($state, $ionicHistory, $ionicViewSwitcher) {

        return {
            restrict:         'E',
            require:          '^jwHeader',
            scope:            true,
            bindToController: true,
            controllerAs:     'vm',
            controller:       angular.noop,
            template:         '<div class="jw-button jw-button-back" ng-click="vm.backButtonClickHandler()"><i class="jwy-icon jwy-icon-double-angle-left"></i></div>',
            replace:          true,
            transclude:       true,
            link:             link
        };

        function link (scope) {

            scope.vm.backButtonClickHandler = backButtonClickHandler;

            ////////////////////////

            function backButtonClickHandler () {

                var viewHistory = $ionicHistory.viewHistory(),
                    history     = viewHistory.histories[$ionicHistory.currentHistoryId()],
                    stack       = history ? history.stack : [],
                    stackIndex  = history.cursor - 1;

                if (viewHistory.backView && viewHistory.backView.stateName !== 'root.video') {

                    $ionicHistory.goBack();
                    return;
                }

                if (stackIndex > 0) {

                    while (stackIndex >= 0) {

                        // search until dashboard or feed state is found
                        if (stack[stackIndex].stateName !== 'root.video' && stack[stackIndex].stateId !== viewHistory.currentView.stateId) {
                            $ionicViewSwitcher.nextDirection('back');
                            stack[stackIndex].go();
                            return;
                        }

                        stackIndex--;
                    }
                }

                goToDashboard();
            }

            /**
             * Go to dashboard state with back transition
             */
            function goToDashboard () {

                $ionicViewSwitcher.nextDirection('back');
                $state.go('root.dashboard');
            }
        }
    }

}());
