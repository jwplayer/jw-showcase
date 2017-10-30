/**
 * Copyright 2017 Longtail Ad Solutions Inc.
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

defineSupportCode(function ({When, Then}) {

    //
    // When steps
    //

    When('I click the left arrow in the featured slider', function () {
        return $('.jw-card-slider-flag-featured .jw-card-slider-button-flag-left').click().then(delay(300));
    });

    When('I click the right arrow in the featured slider', function () {
        return $('.jw-card-slider-flag-featured .jw-card-slider-button-flag-right').click().then(delay(300));
    });

    When('I scroll to the {ordinal} {string} slider', function (num, type) {
        return scrollToElement($$(`.jw-card-slider-flag-${type}`).get(num - 1));
    });

    When('I move my mouse to the first item in the {ordinal} {string} slider', function (num, type) {
        const firstCardSlide = $$(`.jw-card-slider-flag-${type}`).get(num - 1)
            .$('.jw-card-slider-slide.first .jw-card');

        // mouseMove not supported in Firefox and Safari
        return mouseMove(firstCardSlide);
    });

    When(' I click the first featured item in the dashboard', function () {
        return $$('.jw-card-flag-featured').get(0).click();
    });

    When('I click the first item in the {ordinal} {string} slider', function (num, type) {
        return $$(`.jw-card-slider-flag-${type}`).get(num - 1).click();
    });

    When('I click the play icon in the visible item in the featured slider', function () {
        const element = $$(`.jw-card-slider-flag-featured`).get(0)
            .$('.jw-card-slider-slide.is-visible .jw-card-play-button');

        // play icon is not interactable in Firefox
        return clickHelper(element);
    });

    When('I swipe {string} in the {ordinal} {string} slider', function (direction, num, type) {
        var element = $$(`.jw-card-slider-flag-${type} .jw-card-slider-align`).get(num - 1);

        return swipe(element, direction);
    });

    //
    // Then steps
    //

    Then('the featured slider should not be visible', function () {
        return expect($$('.jw-card-slider-flag-featured').count()).to.eventually.equal(0);
    });

    Then('the default sliders should not be visible', function () {
        return expect($$('.jw-card-slider-flag-default').count()).to.eventually.equal(0);
    });

    Then('the featured slider should be visible', function () {
        return expect($$('.jw-card-slider-flag-featured').count()).to.eventually.be.greaterThan(0);
    });

    Then('the default sliders should be visible', function () {
        return expect($$('.jw-card-slider-flag-default').count()).to.eventually.be.greaterThan(0);
    });

    Then('there should be {int} featured items visible', function (num) {
        return expect($$('.jw-card-flag-featured').count()).to.eventually.equal(num);
    });

    Then('there should be {int} default sliders visible', function (num) {
        return expect($$('.jw-card-slider-flag-default').count()).to.eventually.equal(num);
    });

    Then('the {string} item in the {ordinal} {string} slider should not be visible', function (item, num, type) {
        return expect($(`.jw-card-slider-flag-${type} .jw-card-slider-slide.${item}`).getAttribute('class'))
            .to.eventually.not.contain('is-visible');
    });

    Then('the {string} item in the {ordinal} {string} slider should be visible', function (item, num, type) {
        return expect($(`.jw-card-slider-flag-${type} .jw-card-slider-slide.${item}`).getAttribute('class'))
            .to.eventually.contain('is-visible');
    });

    Then('the {string} item in the {string} slider should not be visible', function (item, type) {
        return expect($(`.jw-card-slider-flag-${type} .jw-card-slider-slide.${item}`).getAttribute('class'))
            .to.eventually.not.contain('is-visible');
    });

    Then('the {string} item in the {string} slider should be visible', function (item, type) {
        return expect($(`.jw-card-slider-flag-${type} .jw-card-slider-slide.${item}`).getAttribute('class'))
            .to.eventually.contain('is-visible');
    });

    Then('the {string} arrow in the {ordinal} {string} slider should be disabled', function (side, num, type) {
        return expect($$(`.jw-card-slider-flag-${type}`).get(num - 1).$(`.jw-card-slider-button-flag-${side}`)
            .getAttribute('class'))
            .to.eventually.contain('is-disabled');
    });

    Then('the {string} arrow in the {ordinal} {string} slider should not be disabled', function (side, num, type) {
        return expect($$(`.jw-card-slider-flag-${type}`).get(num - 1).$(`.jw-card-slider-button-flag-${side}`)
            .getAttribute('class'))
            .to.eventually.not.contain('is-disabled');
    });

    Then('the title of the {ordinal} {string} slider should be {string}', function (num, type, title) {

        function trim (text) {
            return text.replace(/\s/g, '');
        }

        title = trim(title);

        return expect($$(`.jw-card-slider-flag-${type}`).get(num - 1).$('.jw-feed-title').getText().then(trim))
            .to.eventually.equal(title);
    });

    Then('the card titles should be visible in the {ordinal} {string} slider', function (num, type) {
        return expect($$(`.jw-card-slider-flag-${type}`).get(num - 1).$('.jw-card-slider-slide.first .jw-card-info')
            .isDisplayed())
            .to.eventually.equal(true);
    });

    Then('the title and description should be visible in the featured slider', function () {
        return expect($('.jw-card-slider-flag-featured .jw-card-slider-slide.first .jw-card-info').isDisplayed())
            .to.eventually.equal(true);
    });

    Then('I should see the description in the first item of the {ordinal} {string} slider', function (num, type) {
        return expect($$(`.jw-card-slider-flag-${type} .first`).get(num - 1).$('.jw-card-description').isDisplayed())
            .to.eventually.equal(true);
    });

    Then('I should see the duration in the first item of the {ordinal} {string} slider', function (num, type) {
        return expect($$(`.jw-card-slider-flag-${type} .first`).get(num - 1).$('.jw-card-duration').isDisplayed())
            .to.eventually.equal(true);
    });

    Then('the card title should be hidden in the featured slider', function () {
        return expect($(`.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-title`).isDisplayed())
            .to.eventually.equal(false);
    });

    Then('the card description should be hidden in the featured slider', function () {
        return expect($(`.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-description`)
            .isDisplayed())
            .to.eventually.equal(false);
    });

    Then('the card titles should be hidden in the {ordinal} {string} slider', function (num, type) {
        return expect($$('.jw-card-slider-flag-'+type).get(num - 1).$('.first .jw-card-info').isDisplayed())
            .to.eventually.equal(false);
    });

    Then('the title of the {ordinal} {string} slider should be hidden', function (num, type) {
        return expect($$('.jw-card-slider-flag-'+type).get(num - 1).$('.jw-feed-title').isDisplayed())
            .to.eventually.equal(false);
    });

});
