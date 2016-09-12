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

    this.When(/^I click on the header back button$/, function (callback) {

        browser
            .findElement(by.css('.jw-header .jw-button'))
            .click()
            .then(callback);
    });

    this.When(/^I click on the first video in the grid overview$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-grid .jw-card-grid-cards > .jw-card:first-child'))
            .click()
            .then(callback);
    });

    this.Then(/^the header title should be "([^"]*)"$/, function (title, callback) {

        browser
            .findElement(by.css('.jw-header .jw-header-title'))
            .getText()
            .then(function (text) {
                expect(text).to.equal(title);
                callback();
            });
    });

};

module.exports = stepsDefinition;
