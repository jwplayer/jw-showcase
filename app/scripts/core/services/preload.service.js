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
        .factory('preload', Preload);

    /**
     * Preload application data
     *
     * @param {$q} $q
     * @param {$state} $state
     * @param {jwShowcase.core.appStore} appStore
     * @param {jwShowcase.config} config
     * @param {jwShowcase.core.configResolver} configResolver
     * @param {jwShowcase.core.cookies} cookies
     * @param {jwShowcase.core.api} api
     * @param {jwShowcase.core.apiConsumer} apiConsumer
     * @param {jwShowcase.core.watchlist} serviceWorker
     * @param {jwShowcase.core.watchlist} watchlist
     * @param {jwShowcase.core.userSettings} userSettings
     * @param {jwShowcase.core.utils} utils
     *
     * @returns {$q.promise}
     */

    Preload.$inject = ['$q', '$state', 'appStore', 'config', 'configResolver', 'cookies', 'api', 'dfp',
        'apiConsumer', 'serviceWorker', 'watchlist', 'watchProgress', 'userSettings', 'bridge', 'utils', 'platform'];

    function Preload ($q, $state, appStore, config, configResolver, cookies, api, dfp, apiConsumer, serviceWorker,
                      watchlist, watchProgress, userSettings, bridge, utils, platform) {

        var defer = $q.defer();

        // already preloaded
        if (!!config.siteName) {
            return $q.resolve();
        }

        configResolver
            .getConfig()
            .then(function (resolvedConfig) {
                return angular.isFunction(window.configLoaded) ? window.configLoaded(resolvedConfig) : resolvedConfig;
            })
            .then(function (resolvedConfig) {

                mergeSetValues(config, resolvedConfig);

                if (angular.isString(config.options.backgroundColor) && '' !== config.options.backgroundColor) {
                    document.body.style.backgroundColor = config.options.backgroundColor;
                }

                if (false === config.options.enableHeader) {
                    document.body.classList.add('jw-flag-no-header');
                }

                if (config.options.highlightColor) {
                    setHighlightColor(config.options.highlightColor);
                }

                if (angular.isObject(config.options.displayAds) && config.options.displayAds.client === 'dfp') {
                    dfp.setup();
                }

                if (config.options.facebookPixelCode) {
                    var script = document.createElement('script');
                    script.src = config.options.facebookPixelCode;
                    script.type = 'text/javascript';
                    document.body.appendChild(script);
                }

                setTimeout(function () {
                    document.body.classList.remove('jw-flag-loading-config');
                });

                if (!utils.flexboxSupport() && !platform.isPrerender) {
                    appStore.loading = false;

                    $state.go('updateBrowser', {directed: true});

                    return;
                }

                $q.all([
                    api.getPlayer(config.player),
                    apiConsumer.loadFeedsFromConfig().then(handleFeedsLoadSuccess)
                ]).then(handlePreloadSuccess, handlePreloadError);

            }, handlePreloadError);

        return defer.promise;

        //////////////////

        function handlePreloadSuccess () {

            var pwa = window.enablePwa && 'serviceWorker' in navigator;

            userSettings.restore();
            showCookiesNotice();

            if (serviceWorker.isSupported()) {
                serviceWorker.prefetchPlayer(jwplayer.utils.repo());
                serviceWorker.prefetchConfig(config);
            }

            // show add to homescreen when PWA is disabled
            if (config.options.enableAddToHome && !window.cordova && !pwa) {
                window.addToHomescreen({appID: 'jwshowcase.addtohome'});
            }

            defer.resolve();
        }

        function handlePreloadError (error) {

            appStore.loading = false;

            $state.go('error', {
                message: error.message
            });

            defer.reject();
        }

        function handleFeedsLoadSuccess () {

            watchlist.restore();
            watchProgress.restore();

            bridge.initialize();
        }

        function showCookiesNotice () {

            var isBrowser    = !window.cordova;
            var cookieNotice = (angular.isObject(config.options.cookieNotice) && config.options.cookieNotice.enabled) ||
                config.options.enableCookieNotice;

            if (cookieNotice && !userSettings.settings.cookies && isBrowser) {
                cookies.show();
            }
        }

        function setHighlightColor (color) {

            var bgClassNames    = [
                    '.jw-button-primary',
                    '.jw-card-watch-progress',
                    '.jw-card-toast-primary',
                    '.jw-offline-message',
                    '.jw-skin-jw-showcase .jw-progress',
                    '.jw-card-in-video-search-timeline:hover',
                    '.jw-card-in-video-search-timeline-dot:hover'
                ],
                colorClassNames = [
                    '.jw-button-default:hover',
                    '.jw-button-default.active',
                    '.jw-button-play .jwy-icon',
                    '.jw-button-watchlist.is-active .jwy-icon-stack',
                    '.jw-cookies-title',
                    '.jw-loading .jw-loading-icon .jwy-icon',
                    '.jw-skin-jw-showcase .jw-button-color:hover',
                    '.jw-skin-jw-showcase .jw-button-color:focus',
                    '.jw-skin-jw-showcase .jw-toggle.jw-off:hover',
                    '.jw-skin-jw-showcase .jw-toggle:not(.jw-off)',
                    '.jw-theme-light .jw-card.jw-card-flag-default .jw-card-title .jw-card-title-matches',
                    '.jw-theme-light .jw-card.jw-card-flag-default .jw-card-description span'
                ];

            utils.addStylesheetRules([
                [bgClassNames.join(','), ['background-color', color, true]],
                [colorClassNames.join(','), ['color', color, true]]
            ]);
        }

        /**
         * Returns true if value is defined and not null
         * @param {*} value
         * @returns {boolean}
         */
        function isSet (value) {
            return angular.isDefined(value) && value !== null;
        }

        /**
         * Merge values that are defined and not null
         * @param {Object} destination
         * @param {Object} source
         */
        function mergeSetValues (destination, source) {

            angular.forEach(source, function (value, key) {

                if (angular.isObject(value) && angular.isObject(destination[key])) {
                    return mergeSetValues(destination[key], value);
                }

                if (isSet(value)) {
                    destination[key] = value;
                }
            });
        }
    }

}());
