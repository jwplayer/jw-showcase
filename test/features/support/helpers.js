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

const
    {defineSupportCode} = require('cucumber');

defineSupportCode(function () {

    global.delay = function (time) {
        return function () {
            return browser.sleep(time);
        };
    };

    global.scrollToElement = function (element) {

        return browser.executeScript(function (element) {
            var header = document.querySelector('.jw-header');
            if (element) {
                document.body.scrollTop = element.offsetTop - (header ? header.offsetHeight : 0);
            }
        }, element.getWebElement());
    };

    global.clickHelper = function (element) {

        if (browser.browserName.toLowerCase() === 'firefox') {
            return browser.executeScript(function (elem) {
                elem.click();
            }, element.getWebElement());
        }

        return element.click();
    };

    global.mouseMove = function (element) {

        if (/safari|firefox/i.test(browser.browserName)) {

            return browser
                .executeScript(function (elem) {
                    elem.classList.add('hover');
                }, element.getWebElement());
        }

        return browser
            .actions()
            .mouseMove(element)
            .perform();
    };

    function mockHoverPseudoElement () {

        var cssRules = [],
            hovers   = [],
            n,
            rule;

        for (n = 0; n < document.styleSheets.length; n++) {
            if (/styles\/main\.css$/.test(document.styleSheets[n].href)) {
                cssRules = document.styleSheets[n].cssRules || document.styleSheets[n].rules;
                break;
            }
        }

        for (rule in cssRules) {
            var theRule = cssRules[rule];
            if (theRule instanceof window.CSSStyleRule && theRule.cssText && theRule.cssText.indexOf(':hover') !== -1) {
                hovers.push(theRule.cssText.replace(':hover', '.hover'));
            }
        }

        var css   = hovers.join(''),
            head  = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = css;

        head.appendChild(style);
    }

    global.navigateToPath = function (page) {

        return browser.get(page)
            .then(function () {
                return browser.wait(function () {
                    return browser.executeScript('return window.$stateIsResolved;').then(function (val) {
                        return val === true;
                    });
                });
            })
            .then(function () {
                return browser.executeScript(mockHoverPseudoElement);
            });
    };
});
