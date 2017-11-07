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
        .run(registerListener);

    registerListener.$inject = ['$rootScope', '$state'];
    function registerListener ($rootScope, $state) {

        $rootScope.$on('$stateChangeError', function (event, toState) {

            var name = toState.name;

            event.preventDefault();

            // prevent loop if something is wrong in error or root.404 state

            if (name === 'error' || name === 'root.videoNotFound' || name === 'root.feedNotFound') {
                return;
            }

            if (name === 'root.feed') {
                $state.go('root.feedNotFound');
            }
            else if (name === 'root.video') {
                $state.go('root.videoNotFound');
            }
            else if (name !== 'root.dashboard') {
                $state.go('root.dashboard');
            }
        });
    }

}());
