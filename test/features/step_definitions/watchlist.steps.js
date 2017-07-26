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
    // When
    //

    When('I scroll to the watchlist slider', function () {
        return scrollToElement($('.jw-feed-saved-videos'));
    });

    When('I click on the card menu button of the first card in the {ordinal} {stringInDoubleQuotes} slider', function (num, type) {
        return $$(`.jw-card-slider-flag-${type}`).get(num - 1).$('.jw-card-slider-slide.first .jw-card-menu-button').click();
    });

    When('I click on the save this video button in the open card menu', function () {
        return $('.jw-card-menu a[ng-click="vm.saveButtonClickHandler()"]').click();
    });

    When('I click on the unsave this video button in the open card menu', function () {
        return $('.jw-card-menu a[ng-click="vm.unsaveButtonClickHandler()"]').click();
    });

    When('I click on the remove this video button in the open card menu', function () {
        return $('.jw-card-menu a[ng-click="vm.removeButtonClickHandler()"]').click();
    });

    When('I click on the cancel button in the open card menu', function () {
        return $('.jw-card-menu a[ng-click="vm.closeButtonClickHandler()"]').click();
    });

    When('I click on the unsave button in the first card of the {ordinal} {stringInDoubleQuotes} slider', function (num, type) {
        return $$(`.jw-card-slider-flag-${type}`).get(num - 1).$('.jw-card-slider-slide.first .jw-card-watchlist-button').click();
    });

    When('I click on the watchlist button in the video toolbar', function () {
        return $('.jw-toolbar-video a[ng-click="vm.watchlistButtonClickHandler()"]').click();
    });

    When('I click on the first card in the watchlist slider', function () {
        return $('.jw-feed-saved-videos .jw-card-slider-slide.first').click();
    });

    //
    // Then steps
    //

    Then('the watchlist slider should be hidden', function () {
        return expect($('.jw-feed-saved-videos').isElementPresent(by.css('.jw-card-slider')))
            .to.eventually.equal(false);
    });

    Then('the watchlist slider should be visible', function () {
        return expect($('.jw-feed-saved-videos').isElementPresent(by.css('.jw-card-slider')))
            .to.eventually.equal(true);
    });

    Then('the watchlist slider should contain {int} items', function (num) {
        return expect($$('.jw-feed-saved-videos .jw-card').count())
            .to.eventually.equal(num);
    });

    Then('the unsave this video button should be visible in the open card menu', function () {
        return expect($('.jw-card-menu').isElementPresent(by.css('a[ng-click="vm.unsaveButtonClickHandler()"]')))
            .to.eventually.equal(true);
    });

    Then('the save this video button should be visible in the open card menu', function () {
        return expect($('.jw-card-menu').isElementPresent(by.css('a[ng-click="vm.saveButtonClickHandler()"]')))
            .to.eventually.equal(true);
    });

    Then('the unsave button should be visible in the first card of the {ordinal} {stringInDoubleQuotes} slider', function (num, type) {
        return expect($$(`.jw-card-slider-flag-${type}`).get(num - 1).$('.jw-card-slider-slide.first')
            .isElementPresent(by.css('.jw-card-watchlist-button'))).to.eventually.equal(true);
    });

    Then('the unsave this video button should be visible in the video toolbar', function () {
        return expect($('.jw-toolbar-video .jw-button-watchlist').getAttribute('class'))
            .to.eventually.contain('is-active');
    });

    Then('the add to watchlist button should be visible on the video toolbar', function () {
        return expect($('.jw-toolbar-video .jw-button-watchlist').getAttribute('class'))
            .to.eventually.not.contain('is-active');
    });

});
