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

    this.When(/^I click on the first video in the grid overview$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-grid .jw-card-grid-cards > .jw-card:first-child .jw-card-container'))
            .click()
            .then(callback);
    });

    this.Then(/^the title in the toolbar should be "([^"]*)"$/, function (title, callback) {

        browser
            .findElement(by.css('.jw-toolbar .jw-toolbar-title'))
            .getText()
            .then(function (text) {
                expect(text).to.equal(title);
                callback();
            });
    });

    this.Then(/^the feed not found page should be visible$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (url) {
                expect(url).to.equal(browser.baseUrl + '/feed-not-found');
                callback();
            });
    });

};

module.exports = stepsDefinition;
