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

    this.Given(/^I set configLocation to "([^"]*)"$/, function (arg1, callback) {

        browser
            .addMockModule('app', function (configLocation) {
                angular.module('app').run(function () {
                    window.configLocation = configLocation;
                });
            }, arg1);

        callback();
    });

    this.Then(/^the logo should use "([^"]*)" as src$/, function (arg1, callback) {

        browser
            .findElement(by.css('.jw-header-logo'))
            .getAttribute('src')
            .then(function (src) {
                expect(src).to.contain(arg1);
                callback();
            });
    });

    this.Then(/^the title should be "([^"]*)"$/, function (arg1, callback) {

        browser
            .getTitle()
            .then(function (title) {
                expect(title).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^the description should be "([^"]*)"$/, function (arg1, callback) {

        browser
            .findElement(by.css('meta[name=description]'))
            .getAttribute('content')
            .then(function (content) {
                expect(content).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^the canonical path should be "([^"]*)"$/, function (path, callback) {

        browser
            .findElement(by.css('link[rel=canonical]'))
            .getAttribute('href')
            .then(function (href) {
                expect(href).to.equal(browser.baseUrl + path);
                callback();
            });
    });

    this.Then(/^the footer text should be "([^"]*)"$/, function (arg1, callback) {

        browser
            .executeScript(function () {
                return document.querySelector('.jw-footer > p').textContent;
            })
            .then(function (content) {
                expect(content).to.equal(arg1);
                callback();
            });
    });

    this.Then(/^the theme should be "([^"]*)"$/, function (arg1, callback) {

        browser
            .findElement(by.tagName('body'))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('jw-theme-' + arg1);
                callback();
            });
    });

    this.Then(/^the featured slider should not be visible/, function (callback) {

        browser
            .findElement(by.css('.featured .jw-card-slider.jw-card-slider-flag-featured'))
            .then(function () {
                expect(true).to.equal(false);
                callback();
            }, function () {
                expect(false).to.equal(false);
                callback();
            });
    });

    this.Then(/^the default sliders should not be visible/, function (callback) {

        browser
            .findElements(by.css('.feed .jw-card-slider-flag-default'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
                callback();
            });
    });

    this.Then(/^the featured items should not be visible/, function (callback) {

        browser
            .findElements(by.css('.featured .jw-card-flag-featured'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
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