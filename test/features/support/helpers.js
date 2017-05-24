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

    global.isCurrentUrl = function (path, success, error) {

        var fullUrl = browser.baseUrl + path;

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {

                if (fullUrl === currentUrl) {
                    setTimeout(success, 100);
                }
                else {
                    error();
                }
            });
    };

    global.navigateToPage = function (path, callback, attempt) {

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

    global.scrollToElement = function (element) {

        return browser
            .executeScript(function (element) {

                var header = document.querySelector('.jw-header');

                if (element) {
                    document.body.scrollTop = element.offsetTop - (header ? header.offsetHeight : 0);
                }
            }, element);
    };

    global.delay = function (fn, time) {
        return function () {
            setTimeout(fn, time);
        };
    };

    global.clickElement = function (selector, callback) {
        return browser
            .executeScript(function (cssSelector) {
                document.querySelector(cssSelector)
                    .click();
            }, selector);
    };
};
