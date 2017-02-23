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

var stepsDefinition = function () {
    
    this.Given(/^I go to the "([^"]*)" page$/, function (arg1, callback) {

        arg1 = 'index' === arg1 ? '/' : arg1;

        navigateToPage(arg1, callback);
    });

    this.Given(/^I go directly to the "([^"]*)" page$/, function (arg1, callback) {

        arg1 = 'index' === arg1 ? '/' : arg1;

        browser
            .get(arg1)
            .then(function () {
                callback();
            });
    });

    this.Given(/^I am still on the "([^"]*)" page$/, function (arg1, callback) {

        arg1 = 'index' === arg1 ? '/' : arg1;

        isCurrentUrl(arg1, callback, function () {
            navigateToPage(arg1, callback);
        });
    });

    this.When(/^I wait until the page has been loaded$/, function (callback) {

        browser
            .waitForAngular()
            .then(delay(callback, 500));
    });

    this.When(/^I do nothing$/, function (callback) {

        callback();
    });

    this.When(/^wait for (\d+) seconds$/, function (seconds, callback) {

        browser
            .sleep(seconds * 1000)
            .then(callback);
    });

    this.When(/^I click on the back button in the toolbar$/, function (callback) {

        scrollToElement('.jw-toolbar')
            .then(function () {
                browser
                    .findElement(by.css('.jw-toolbar .jw-button-back'))
                    .click()
                    .then(callback);
            });
    });

    this.Then(/^I should navigate to the "([^"]*)" page/, function (arg1, callback) {

        arg1 = 'index' === arg1 ? '/' : arg1;

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {
                expect(currentUrl).to.contain(arg1);
                callback();
            });
    });

};

module.exports = stepsDefinition;