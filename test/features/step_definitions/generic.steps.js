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

    Given('I go to the {stringInDoubleQuotes} page', function (page) {
        page = page === 'index' ? '/' : page;

        return navigateToPath(page);
    });

    Given('I am still on the {stringInDoubleQuotes} page', function (page) {
        page = page === 'index' ? '/' : page;

        return browser.getCurrentUrl().then(function (location) {
            if (location !== browser.baseUrl + page) {
                return navigateToPath(page);
            }
        });
    });

    Given('the browser has localStorage support', function () {

        const world = this;

        if (false === world.localStorageSupport) {
            return 'pending';
        }

        return browser.executeScript('return window.localStorageSupport').then(function (value) {
            world.localStorageSupport = value;

            if (false === value) {
                return 'pending';
            }
        });
    });

    Given('localStorage key {stringInDoubleQuotes} has the following data:', function (key, data) {
        return browser.addMockModule('injectLocalStorage', function (lKey, lData) {
            angular.module('injectLocalStorage', []).run(function () {
                if (window.localStorageSupport) {
                    window.localStorage.setItem(lKey, lData);
                }
            });
        }, key, data);
    });

    //
    // When
    //

    When('wait for {number} seconds', function (seconds) {
        return browser.sleep(seconds * 1000);
    });

    When('I click on the back button in the toolbar', function () {
        return $('.jw-toolbar .jw-button-back').click();
    });

    When('I click on the first video in the grid overview', function () {
        const card = $$('.jw-card-grid .jw-card').get(0);

        // safari does not trigger an actual click on the first click command
        if (this.browserName === 'safari') {
            return card.click().click();
        }

        return card.click();
    });

    When('I seek to {int} seconds in the video', function (seconds) {
        return browser.executeScript(`jwplayer().seek(${seconds})`);
    });

    When('I pause the page', function (seconds) {
        return browser.pause();
    });

    When('I wait until the page is {stringInDoubleQuotes}', function (page) {
        return browser.wait(function () {
            return browser.getCurrentUrl().then(function (url) {
                return url.indexOf(page) !== -1;
            })
        });
    });

    //
    // Then steps
    //

    Then('the page should be {stringInDoubleQuotes}', function (page) {
        page = page === 'index' ? '/' : page;
        return expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + page);
    });

    Then('the page title should be {stringInDoubleQuotes}', function (title) {
        return expect(browser.getTitle()).to.eventually.equal(title);
    });

    Then('the description should be:', function (description) {
        return expect($('meta[name="description"]').getAttribute('content'))
            .to.eventually.equal(description);
    });

    Then('the canonical path should be {stringInDoubleQuotes}', function (path) {
        return expect($('link[rel=canonical]').getAttribute('href'))
            .to.eventually.equal(browser.baseUrl + path);
    });

    Then('the subheader title should be {stringInDoubleQuotes}', function (text) {
        return expect($('.jw-toolbar-subheader .jw-toolbar-title').getText()).to.eventually.equal(text);
    });

});
