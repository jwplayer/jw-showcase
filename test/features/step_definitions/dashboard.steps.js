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

    this.Given(/^I scroll to the first default slider$/, function (callback) {

        browser
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {
                elements[0]
                    .getLocation()
                    .then(function (location) {

                        browser
                            .executeScript('window.scrollTo(0, ' + location.y + ')')
                            .then(function () {
                                callback();
                            });
                    });
            });
    });

    this.When(/^I slide all the way to the right in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-indicator:last-child'))
            .click()
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I click the right arrow in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-button--right'))
            .click()
            .then(function () {
                // give some time to animate
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I click the left arrow in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-button--left'))
            .click()
            .then(function () {
                // give some time to animate
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I swipe left in the first default slider/, function (callback) {

        var firstDefaultSlider = element
            .all(by.css('.jw-card-slider--default'))
            .get(0)
            .element(by.css('.jw-card-slider-container'))
            .getWebElement();

        swipe(firstDefaultSlider, 'left')
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I swipe right in the first default slider$/, function (callback) {

        var firstDefaultSlider = element
            .all(by.css('.jw-card-slider--default'))
            .get(0)
            .element(by.css('.jw-card-slider-container'))
            .getWebElement();

        swipe(firstDefaultSlider, 'right')
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I click the first item in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-slide.is-visible'))
            .click()
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I click the play icon in the visible item in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card-play-button'))
            .click()
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I click the first featured item in the dashboard/, function (callback) {

        browser
            .findElement(by.css('.jw-row.is-visible-mobile .jw-card--featured:first-child'))
            .click()
            .then(function () {
                setTimeout(callback, 1000);
            });
    });

    this.When(/^I move my mouse to the first item in the default slider$/, function (callback) {

        if ('safari' === browser.browserName) {
            return callback(null, 'pending');
        }

        browser
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {

                browser
                    .actions()
                    .mouseMove(elements[0].findElement(by.css('.jw-card-slider-slide:first-child')))
                    .perform()
                    .then(function () {
                        setTimeout(callback, 1000);
                    });
            });
    });

    this.Then(/^the featured slider should be visible/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider.jw-card-slider--featured'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the featured slider should not be visible/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider.jw-card-slider--featured'))
            .then(function () {
                expect(true).to.equal(false);
                callback();
            }, function () {
                expect(false).to.equal(false);
                callback();
            });
    });

    this.Then(/^the featured items should not be visible/, function (callback) {

        browser
            .findElements(by.css('.jw-row.is-visible-mobile .jw-card--featured'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
                callback();
            });
    });

    this.Then(/^the default sliders should not be visible/, function (callback) {

        browser
            .findElements(by.css('.jw-card-slider.jw-card-slider--default'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
                callback();
            });
    });

    this.Then(/^there should be "([^"]*)" featured items visible/, function (arg1, callback) {

        browser
            .findElements(by.css('.jw-row.is-visible-mobile .jw-card--featured'))
            .then(function (elements) {
                expect(String(elements.length)).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^there should be "([^"]*)" default sliders visible/, function (arg1, callback) {

        browser
            .findElements(by.css('.jw-card-slider.jw-card-slider--default'))
            .then(function (elements) {
                expect(String(elements.length)).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^the "([^"]*)" item in the featured slider should be visible/, function (arg1, callback) {

        browser
            .findElement(by.css('.jw-card-slider.jw-card-slider--featured'))
            .findElement(by.css('.jw-card-slider-slide:nth-child(' + arg1 + ')'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" item in the first default slider should be visible/, function (arg1, callback) {

        browser
            .findElements(by.css('.jw-card-slider.jw-card-slider--default'))
            .then(function (elements) {
                elements[0]
                    .findElement(by.css('.jw-card-slider-slide:nth-child(' + arg1 + ')'))
                    .getAttribute('class')
                    .then(function (classNames) {
                        expect(classNames).to.contain('is-visible');
                        callback();
                    });
            });
    });

    this.Then(/^the "([^"]*)" arrow in the featured slider should be disabled/, function (arg1, callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-button--' + arg1))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-disabled');
                callback();
            });
    });

    this.Then(/^the indicator should highlight the last bullet/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-indicators'))
            .findElement(by.css('.jw-card-slider-indicator:last-child'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-active');
                callback();
            });
    });

    this.Then(/^the title and description should be visible in the featured slider/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card-info'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^I should navigate to the "([^"]*)" page/, function (arg1, callback) {

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {
                expect(currentUrl).to.contain(arg1);
                callback();
            });
    });

    this.Then(/^the titles of the items should be visible/, function (callback) {

        browser
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {
                elements[0]
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
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {
                elements[0]
                    .findElement(by.css('.jw-card-slider-title'))
                    .isDisplayed()
                    .then(function (isDisplayed) {
                        expect(isDisplayed).to.equal(true);
                        callback();
                    });
            });
    });

    this.Then(/^the title of the first default slider should be "([^"]*)"/, function (expectedTitle, callback) {

        browser
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {
                elements[0]
                    .findElement(by.css('.jw-card-slider-title'))
                    .getText()
                    .then(function (title) {
                        expect(title).to.equal(expectedTitle);
                        callback();
                    });
            })
    });

    this.Then(/^the title of the second default slider should be "([^"]*)"/, function (expectedTitle, callback) {

        browser
            .findElements(by.css('.jw-card-slider--default'))
            .then(function (elements) {
                elements[1]
                    .findElement(by.css('.jw-card-slider-title'))
                    .getText()
                    .then(function (title) {
                        expect(title).to.equal(expectedTitle);
                        callback();
                    });
            })
    });

    this.Then(/^I should see the description in the default slider/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--default'))
            .findElement(by.css('.jw-card-slider-slide:first-child .jw-card-description'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^I should see the duration in the default slider/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider--default'))
            .findElement(by.css('.jw-card-slider-slide:first-child .jw-card-duration'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^I should see an error with message "([^"]*)"/, function (arg1, callback) {

        browser
            .findElement(by.css('.jw-modal-message'))
            .getText()
            .then(function (textContent) {
                expect(textContent).to.equal(arg1);
                callback();
            });
    });
};

module.exports = stepsDefinition;