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

    this.Given(/^I have the following saved watchlist:$/, function (data, callback) {

        browser
            .addMockModule('app', function (watchlist) {
                angular.module('app').run(function () {
                    window.localStorage.setItem('jwshowcase.watchlist', JSON.stringify(watchlist));
                });
            }, data.hashes());

        callback();
    });

    this.When(/^I click on the card menu button of the first card$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child .jw-card-menu-button'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the add to watchlist button in the card menu$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-button[ng-click="vm.saveButtonClickHandler()"]'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the remove from watchlist button in the card menu$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-button[ng-click="vm.unsaveButtonClickHandler()"]'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the close button in the card menu$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-button[ng-click="vm.closeButtonClickHandler()"]'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the remove from watchlist button in the card$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-card-watchlist-button'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the watchlist button in the video toolbar$/, function (callback) {

        browser
            .findElement(by.css('.jw-toolbar-video .jw-button-watchlist'))
            .click()
            .then(delay(callback, 1200));
    });

    this.When(/^I click on the first card in the watchlist slider$/, function (callback) {

        browser
            .findElement(by.css('.watchlist .jw-card-slider-slide:first-child .jw-card'))
            .click()
            .then(delay(callback, 1200));
    });

    this.Given(/^I scroll to the watchlist slider$/, function (callback) {

        scrollToElement('.watchlist .jw-card-slider')
            .then(callback);
    });

    this.Then(/^the card menu should show a remove from watchlist button$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-button[ng-click="vm.unsaveButtonClickHandler()"]'))
            .then(function () {
                expect(true).to.equal(true);
                callback();
            }, function () {
                expect(true).to.equal(false);
                callback();
            });
    });

    this.Then(/^the card menu should show an add to watchlist button$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-button[ng-click="vm.saveButtonClickHandler()"]'))
            .then(function () {
                expect(true).to.equal(true);
                callback();
            }, function () {
                expect(true).to.equal(false);
                callback();
            });
    });

    this.Then(/^there should be 1 video in the watchlist$/, function (callback) {

        browser
            .findElements(by.css('.watchlist .jw-card-slider-slide'))
            .then(function (cards) {
                expect(cards.length).to.equal(1);
                callback();
            });
    });

    this.Then(/^the watchlist should be hidden$/, function (callback) {

        browser
            .findElements(by.css('.watchlist .jw-card-slider'))
            .then(function (sliders) {
                expect(sliders.length).to.equal(0);
                callback();
            });
    });

    this.Then(/^the remove from watchlist button should be visible in the card$/, function (callback) {

        browser
            .findElement(by.css('.feed .jw-card-slider:nth-child(1) .jw-card-slider-slide:first-child'))
            .findElement(by.css('.jw-card-watchlist-button'))
            .isDisplayed()
            .then(function (displayed) {
                expect(displayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the remove from watchlist button should be visible on the video toolbar$/, function (callback) {

        browser
            .findElement(by.css('.jw-toolbar-video .jw-button-watchlist'))
            .getText()
            .then(function (text) {
                text = text.replace('\n', ' ');
                expect(text).to.equal('Unsave video');
                callback();
            });
    });

    this.Then(/^the add to watchlist button should be visible on the video toolbar$/, function (callback) {

        browser
            .findElement(by.css('.jw-toolbar-video .jw-button-watchlist'))
            .getText()
            .then(function (text) {
                text = text.replace('\n', ' ');
                expect(text).to.equal('Save video');
                callback();
            });
    });

    this.Then(/^I should see the watchlist below the video$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider .jw-card-slider-title'))
            .getText()
            .then(function (text) {
                expect(text).to.equal('Watchlist (1)');
                callback();
            });
    });

    this.Then(/^there should be 1 video in the watchlist below the video$/, function (callback) {

        browser
            .findElements(by.css('.jw-card-slider .jw-card-slider-list > .jw-card-slider-slide'))
            .then(function (cards) {
                expect(cards.length).to.equal(1);
                callback();
            });
    });
};

module.exports = stepsDefinition;
