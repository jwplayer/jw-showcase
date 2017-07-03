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

    function mockHoverPseudoElement () {
        var cssRules = [];
        if (document.styleSheets[2].cssRules) {
            cssRules = document.styleSheets[2].cssRules
        } else if (document.styleSheets[2].rules) {
            cssRules = document.styleSheets[2].rules
        }

        var hovers = []

        for (rule in cssRules) {
            var theRule = cssRules[rule];
            if(theRule.cssText && theRule.cssText.indexOf(':hover') !== -1) {
                hovers.push(theRule.cssText.replace(':hover', '.hover'));

            }
        }

        var css = hovers.join(';'),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }


    global.navigateToPath = function (page) {

        return browser.get(page).then(function () {
            return browser.wait(function () {
                return browser.executeScript('return window.$stateIsResolved;').then(function (val) {
                    return browser.executeScript(mockHoverPseudoElement).then(() => {
                        return val === true;
                    });
                });
            });
        });
    };
});
