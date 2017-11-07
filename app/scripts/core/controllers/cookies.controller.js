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
        .controller('CookiesController', CookiesController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.CookiesController
     *
     * @requires jwShowcase.core.userSettings
     */
    CookiesController.$inject = ['userSettings', 'popupInstance', 'config'];
    function CookiesController (userSettings, popupInstance, config) {

        var vm = this;

        vm.config = config;

        vm.acceptButtonClickHandler = acceptButtonClickHandler;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.CookiesController#acceptButtonClickHandler
         * @methodOf jwShowcase.core.CookiesController
         *
         * @description
         * Handle click event on the accept button.
         *
         * @param {$event} event Synthetic event object.
         */
        function acceptButtonClickHandler () {

            // save in userSettings
            userSettings.set('cookies', true);

            // hide cookies popup
            popupInstance.close(true);
        }
    }

}());
