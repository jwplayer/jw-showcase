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
        .module('jwShowcase.settings')
        .controller('SettingsController', SettingsController);

    /**
     * @ngdoc controller
     * @name jwShowcase.settings.SettingsController
     *
     * @requires jwShowcase.core.platform
     */
    SettingsController.$inject = ['dataStore', 'watchlist', 'watchProgress', 'userSettings', 'popup', '$state', 'utils',
        'platform'];

    function SettingsController (dataStore, watchlist, watchProgress, userSettings, popup, $state, utils, platform) {

        var vm = this;

        vm.watchlist         = dataStore.getFeed('saved-videos');
        vm.watchProgress     = dataStore.getFeed('continue-watching');
        vm.conserveBandwidth = userSettings.settings.conserveBandwidth;
        vm.continueWatching  = userSettings.settings.continueWatching;

        vm.toggleChangeHandler = toggleChangeHandler;
        vm.clearWatchlist      = clearWatchlist;
        vm.clearWatchProgress  = clearWatchProgress;
        vm.cardClickHandler    = cardClickHandler;

        /**
         * @ngdoc method
         * @name jwShowcase.settings.SettingsController#toggleChangeHandler
         * @methodOf jwShowcase.settings.SettingsController
         *
         * @description
         * Handle change event in toggle directive.
         */
        function toggleChangeHandler (type) {

            // empty watchProgress when user disables continueWatching
            if (type === 'continueWatching' && !vm[type]) {
                watchProgress.clearAll();
            }

            userSettings.set(type, vm[type]);
        }

        /**
         * @ngdoc method
         * @name jwShowcase.settings.SettingsController#clearWatchlist
         * @methodOf jwShowcase.settings.SettingsController
         *
         * @description
         * Show confirmation modal and clear watchlist if the user clicks on 'ok'.
         */
        function clearWatchlist () {

            popup
                .show({
                    controller:  'ConfirmController as vm',
                    templateUrl: 'views/core/popups/confirm.html',
                    resolve:     {
                        message: 'Do you wish to clear your Saved videos list?'
                    }
                })
                .then(function (result) {

                    if (true === result) {
                        watchlist.clearAll();
                    }
                });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.settings.SettingsController#clearWatchProgress
         * @methodOf jwShowcase.settings.SettingsController
         *
         * @description
         * Show confirmation modal and clear watchProgress if the user clicks on 'ok'.
         */
        function clearWatchProgress () {

            popup
                .show({
                    controller:  'ConfirmController as vm',
                    templateUrl: 'views/core/popups/confirm.html',
                    resolve:     {
                        message: 'Do you wish to clear your Continue watching list?'
                    }
                })
                .then(function (result) {

                    if (true === result) {
                        watchProgress.clearAll();
                    }
                });
        }

        /**
         * @ngdoc method
         * @name jwShowcase.settings.SettingsController#cardClickHandler
         * @methodOf jwShowcase.settings.SettingsController
         *
         * @description
         * Handle click event on the card.
         *
         * @param {jwShowcase.core.item}    item            Clicked item
         * @param {boolean}                 clickedOnPlay   Did the user clicked on the play button
         */
        function cardClickHandler (item, clickedOnPlay) {

            $state.go('root.video', {
                list:      item.feedid,
                mediaId:   item.mediaid,
                slug:      utils.slugify(item.title),
                autoStart: clickedOnPlay || platform.isMobile
            });
        }
    }

}());
