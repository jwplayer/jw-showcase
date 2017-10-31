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

defineSupportCode(function ({Given, When, Then}) {
    //
    // Given steps
    //

    //
    // When steps
    //

    When('I click on the search button in the header', function () {
        return $('.jw-header .jw-button-search').click();
    });

    When('I click on the close search button', function () {
        return $('.jw-header .jw-button-close-search').click();
    });

    When('I click on the search input', function () {
        return $('.jw-header .jw-search-input').click();
    });

    When('I type {string} in the search input', function (phrase) {
        return $('.jw-header .jw-search-input').sendKeys(phrase);
    });

    When('I press escape', function () {
        return $('.jw-header .jw-search-input').sendKeys(protractor.Key.ESCAPE);
    });

    When('I click on the show caption matches toggle', function () {
        return $('.jw-search-captions-toggle .jw-toggle').click();
    });

    When('I move my mouse on the {ordinal} in-video search element of the {ordinal} card', function (inVideoNum, cardNum) {
        let searchElement = $$('.jw-card').get(cardNum - 1).all(by.tagName('.jw-card-in-video-search-timeline-dot')).get(inVideoNum);

        // mouseMove not supported in Firefox and Safari
        return mouseMove(searchElement);
    });

    When('I move my mouse on the {ordinal} card', function (cardNum) {
        let cardElement = $$('.jw-card').get(cardNum - 1);

        // mouseMove not supported in Firefox and Safari
        return mouseMove(cardElement);
    });

    When('I click on the {ordinal} in-video search element of the {ordinal} card', function (inVideoNum, cardNum) {
        let searchElement = $$('.jw-card').get(cardNum - 1).all(by.tagName('.jw-card-in-video-search-timeline-dot')).get(inVideoNum);

        return searchElement.click();
    });

    //
    // Then steps
    //

    Then('the search bar should be visible', function () {
        return expect($('.jw-search .jw-search-input').isDisplayed()).to.eventually.equal(true);
    });

    Then('the search bar should not be visible', function () {
        return expect($('.jw-search .jw-search-input').isDisplayed()).to.eventually.equal(false);
    });

    Then('the search page should show {int} items', function (count) {
        return expect($$('.jw-card').count()).to.eventually.equal(count);
    });

    Then('the content title should be {string}', function (title) {
        return expect($('.jw-page-title').getText().then((text) => text.trim())).to.eventually.equal(title);
    });

    Then('the search button should not be visible', function () {
        return expect($$('.jw-button-search').count()).to.eventually.equal(0);
    });

    Then('an in-video search result should be visible', function () {
        return expect($$('.jw-card-in-video-search-timeline-dot').get(0).isDisplayed()).to.eventually.equal(true);
    });

    Then('the include captions toggle is active', function () {
        return expect($('.jw-search-captions-toggle .jw-toggle').getAttribute('class')).to.eventually.contain('jw-toggle-flag-checked');
    });

    Then('the {ordinal} card title should include {string}', function (cardNum, titleText) {
        return expect($(`.jw-card:nth-of-type(${cardNum}) .jw-card-title`).getText()).to.eventually.contain(titleText);
    });

    Then('the {ordinal} card description should be {string}', function (cardNum, descriptionText) {
        return expect($(`.jw-card:nth-of-type(${cardNum}) .jw-card-description`).getText()).to.eventually.contain(descriptionText);
    });

    Then('the {ordinal} card poster should be {string}', function (cardNum, url) {
        return expect($(`.jw-card:nth-of-type(${cardNum}) .jw-card-poster`).getAttribute('style')).to.eventually.contain(url);
    });
});
