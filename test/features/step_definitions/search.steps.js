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

});
