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

module.exports = function () {

    root.isCurrentUrl = function (path, success, error) {

        var fullUrl = browser.baseUrl + path;

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {

                if (fullUrl === currentUrl) {
                    setTimeout(success, 1000);
                }
                else {
                    error();
                }
            });
    };

    root.navigateToPage = function (path, callback, attempt) {

        attempt = attempt || 1;

        browser
            .get(path)
            .then(function () {

                isCurrentUrl(path, callback, function () {

                    if (attempt < 3) {
                        navigateToPage(path, callback, attempt + 1);
                    }
                });
            });
    };

    root.scrollToElement = function (selector) {

        return browser
            .executeScript(function (selector) {
                var element = document.querySelector(selector);

                if (element) {
                    angular.element(document.querySelector(".ionic-scroll"))
                        .scope()
                        .scrollCtrl
                        .scrollTo(0, element.offsetTop);
                }
            }, selector);
    };

    root.delay = function (fn, time) {
        return function () {
            setTimeout(fn, time);
        };
    };
};
