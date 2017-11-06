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
     * @ngdoc overview
     * @name jwShowcase.core
     *
     * @description
     * Application's core module
     */
    angular
        .module('jwShowcase.core', [])
        .run(run)
        .config(config);

    config.$inject = ['$stateProvider', '$urlMatcherFactoryProvider', '$touchProvider', 'seoProvider',
        'historyProvider'];

    function config ($stateProvider, $urlMatcherFactoryProvider, $touchProvider, seoProvider, historyProvider) {

        // eliminate the ~300ms click delay for touch devices
        if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
            $touchProvider.ngClickOverrideEnabled(true);
        }

        // this makes the trailing slash in states URL's optional.
        $urlMatcherFactoryProvider
            .strictMode(false);

        // add a boolean URL matcher type, to make it possible to use `$stateParams.param === true`.
        $urlMatcherFactoryProvider
            .type('boolean', {
                name:    'boolean',
                decode:  function (val) {
                    return val === 'true';
                },
                equals:  function (a, b) {
                    return angular.equals(a, b);
                },
                is:      function (val) {
                    return typeof val === 'boolean';
                },
                pattern: /true|false/
            });

        // define state which is used while navigating back while the history is empty.
        historyProvider
            .setDefaultState('root.dashboard');

        // define abstract root state. The root state will also preload the application.
        $stateProvider
            .state('root', {
                abstract:    true,
                resolve:     {
                    preload: 'preload'
                },
                templateUrl: 'views/core/root.html'
            });

        // define default page SEO parameters.
        seoProvider
            .otherwise(['$location', 'config', function ($location, config) {
                return {
                    title:       config.siteName,
                    description: config.description,
                    canonical:   $location.absUrl()
                };
            }]);
    }

    run.$inject = ['$document', 'history', 'platform'];

    function run ($document, history, platform) {

        // initialize history and platform services.
        history.attach();
        platform.prepare();

        // listen for keyup events and enable the focus ring when using the tab key.
        $document.on('keyup', function (evt) {
            if (9 === evt.which) {
                document.body.classList.remove('jw-flag-no-focus');
            }
        });

        // disable focus ring when a mouse click event is triggered.
        $document.on('click', function () {
            document.body.classList.add('jw-flag-no-focus');
        });
    }

}());
