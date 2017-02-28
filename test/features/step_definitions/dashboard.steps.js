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

    this.When(/^I scroll to the featured default slider$/, function (callback) {

        scrollToElement('.featured .jw-card-slider-flag-featured')
            .then(callback);
    });

    this.When(/^I scroll to the first default slider$/, function (callback) {

        scrollToElement('.feed .jw-card-slider-flag-default:nth-child(1)')
            .then(callback);
    });

    this.When(/^I scroll to the second default slider$/, function (callback) {

        scrollToElement('.feed .jw-card-slider-flag-default:nth-child(2)')
            .then(callback);
    });

    this.When(/^I slide all the way to the right in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-indicator:last-child'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I click the right arrow in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-button-flag-right'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I click the left arrow in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-button-flag-left'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I swipe left in the first default slider/, function (callback) {

        swipe('.feed .jw-card-slider-flag-default:first-child .jw-card-slider-container', 'left')
            .then(delay(callback, 1000));
    });

    this.When(/^I swipe right in the first default slider$/, function (callback) {

        swipe('.feed .jw-card-slider-flag-default:first-child .jw-card-slider-container', 'right')
            .then(delay(callback, 1000));
    });

    this.When(/^I click the first item in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I click the play icon in the visible item in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card-play-button'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I click the first featured item in the dashboard/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-row.is-visible-mobile .jw-card-flag-featured:first-child .jw-card-container'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I move my mouse to the first item in the default slider$/, function (callback) {

        if ('safari' === browser.browserName) {
            return callback(null, 'pending');
        }

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .then(function (element) {

                browser
                    .actions()
                    .mouseMove(element.findElement(by.css('.jw-card-slider-slide:first-child')))
                    .perform()
                    .then(delay(callback, 1000));
            });
    });

    this.Then(/^the featured slider should be visible/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider.jw-card-slider-flag-featured'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^there should be featured items visible/, function (callback) {

        browser
            .findElements(by.css('.featured .jw-card-flag-featured'))
            .then(function (elements) {
                expect(elements.length).to.be.greaterThan(0);
                callback();
            });
    });

    this.Then(/^there should be "([^"]*)" default sliders visible/, function (arg1, callback) {

        browser
            .findElements(by.css('.feed .jw-card-slider-flag-default'))
            .then(function (elements) {
                expect(String(elements.length)).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^the first item in the featured slider should not be visible/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured'))
            .findElement(by.css('.jw-card-slider-slide.first'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).not.to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the first item in the featured slider should be visible/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured'))
            .findElement(by.css('.jw-card-slider-slide.first'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" item in the featured slider should be visible/, function (arg1, callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured'))
            .findElement(by.css('.jw-card-slider-slide:nth-child(' + arg1 + ')'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" item in the first default slider should be visible/, function (arg1, callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .findElement(by.css('.jw-card-slider-slide:nth-child(' + arg1 + ')'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" arrow in the featured slider should be disabled/, function (arg1, callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-button-flag-' + arg1))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-disabled');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" arrow in the first default slider should be disabled/, function (arg1, callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child .jw-card-slider-button-flag-' + arg1))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-disabled');
                callback();
            });
    });

    this.Then(/^the indicator should highlight the first bullet/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-indicator'))
            .findElement(by.css('.jw-card-slider-indicator-dot:first-child'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-active');
                callback();
            });
    });

    this.Then(/^the title and description should be visible in the featured slider/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card-info'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the titles of the items should be visible/, function (callback) {

        scrollToElement('.feed .jw-card-slider-flag-default:first-child')
            .then(function () {
                browser
                    .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
                    .findElement(by.css('.jw-card-slider-slide:first-child .jw-card-title'))
                    .isDisplayed()
                    .then(function (isDisplayed) {
                        expect(isDisplayed).to.equal(true);
                        callback();
                    });
            });
    });

    this.Then(/^I should see the title of the first default slider/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .findElement(by.css('.jw-card-slider-title'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the title of the first default slider should be "([^"]*)"/, function (expectedTitle, callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .findElement(by.css('.jw-card-slider-title'))
            .getText()
            .then(function (title) {

                // title can contain an icon and multiple whitespaces
                title = title
                    .replace(/\s{2,}/g, ' ')
                    .trim();

                expect(title).to.equal(expectedTitle);
                callback();
            });
    });

    this.Then(/^the title of the second default slider should be "([^"]*)"/, function (expectedTitle, callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:nth-child(2)'))
            .findElement(by.css('.jw-card-slider-title'))
            .getText()
            .then(function (title) {
                expect(title).to.equal(expectedTitle);
                callback();
            });
    });

    this.Then(/^I should see the description in the default slider/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .findElement(by.css('.jw-card-slider-slide:first-child .jw-card-description'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^I should see the duration in the default slider/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider-flag-default:first-child'))
            .findElement(by.css('.jw-card-slider-slide:first-child .jw-card-duration'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });
};

module.exports = stepsDefinition;