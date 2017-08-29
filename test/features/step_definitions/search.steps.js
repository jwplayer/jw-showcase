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

    When('I type {stringInDoubleQuotes} in the search input', function (phrase) {
        return $('.jw-header .jw-search-input').sendKeys(phrase);
    });

    When('I click on the invideo search toggle', function () {
        return $('.jw-header .jw-toggle').click();
    });

    When('I hover on the first invideo search dot', function () {
        return mouseMove($$('.jw-card-in-video-search-timeline-dot').get(0));
    });

    When('I click on the {ordinal} invideo search dot', function (whichItem) {
        return ($$('.jw-card-in-video-search-timeline-dot').get(whichItem - 1)).click();
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

    Then('the content title should be {stringInDoubleQuotes}', function (title) {
        return expect($('.jw-content-title').getText().then((text) => text.trim())).to.eventually.equal(title);
    });

    Then('the search button should not be visible', function () {
        return expect($$('.jw-button-search').count()).to.eventually.equal(0);
    });

    Then('a result with invideo results should show', function () {
        return expect($$('.jw-card-in-video-search-timeline-dot').get(0).isDisplayed()).to.eventually.equal(true);
    });

    Then('the show more buttons should be visible', function () {
        return expect($('.jw-button-show-more').isDisplayed()).to.eventually.equal(true);
    });
    
    Then('The description text should be {stringInDoubleQuotes}', function (descriptionText) {
        return expect($$('.jw-card-description').get(0).getText()).to.eventually.contain(descriptionText);
    });

});
