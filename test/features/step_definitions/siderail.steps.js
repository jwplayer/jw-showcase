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

    this.Then(/^the siderail title should be "([^"]*)"$/, function (text, callback) {

        browser
            .findElement(by.css('.jw-side-rail-title'))
            .getText()
            .then(function (textContent) {
                expect(textContent.trim()).to.equal(text);
                callback();
            });
    });

    this.Then(/^the siderail title should be visible$/, function (callback) {

        browser
            .findElement(by.css('.jw-side-rail-title'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^there should be siderailitems in the siderail$/, function (callback) {

        browser
            .findElements(by.css('.jw-side-rail-item'))
            .then(function (elements) {
                expect(elements.length).to.equal(4);
                callback();
            });
    });

    this.Then(/^the (\d+)st siderailitem should have a poster$/, function (number, callback) {

        browser
            .findElements(by.css('.jw-side-rail-poster'))
            .get(number)
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the (\d+)st siderailitem should have a title$/, function (number, callback) {

        browser
            .findElement(by.css('.jw-side-rail-title'))
            .get(number)
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });
};

module.exports = stepsDefinition;
