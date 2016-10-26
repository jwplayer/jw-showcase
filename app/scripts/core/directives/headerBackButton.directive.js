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

    headerBackButtonDirective.$inject = [];
    function headerBackButtonDirective () {

        return {
            restrict:         'E',
            require:          '^jwHeader',
            scope:            true,
            bindToController: true,
            controllerAs:     'vm',
            controller:       'HeaderBackButtonController',
            templateUrl:      'views/core/headerBackButton.html',
            replace:          true,
            transclude:       true
        };
    }

}());
