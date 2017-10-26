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

    Given('I set the configLocation to {string}', function (configLocation) {
        return browser
            .addMockModule('app', `angular.module('app').run(function () {window.configLocation="${configLocation}";});`);
    });

    //
    // When steps
    //

    //
    // Then steps
    //

    Then('the logo should use {string} as src', function (src) {
        let regex = new RegExp(`${src}$`);
        return expect($('.jw-header-logo').getAttribute('src')).to.eventually.match(regex);
    });

    Then('the theme should be {string}', function (theme) {
        return expect($('body').getAttribute('class')).to.eventually.contain(`jw-theme-${theme}`);
    });

    Then('the footer text should be {string}', function (text) {
        return expect($('.jw-footer > p').getText()).to.eventually.equal(text);
    });

    Then('the error page is shown', function () {
        return expect($('.jw-modal-message').isPresent()).to.eventually.equal(true);
    });

    Then('the error page displays the following message {string}', function (message) {
        return expect($('.jw-modal-message').getText()).to.eventually.contain(message);
    });

});
