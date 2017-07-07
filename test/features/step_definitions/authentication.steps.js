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

    Given('the login modal is visible', function () {
        var element = $('.jw-popup-login');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });


    Then('the userbadge should not be visible', function () {
        var element = $$('.jw-user-badge');
        return expect(element.count()).to.eventually.equal(0);
    });

    Then('the userbadge should be visible', function () {
        var element = $$('.jw-user-badge');
        return expect(element.count()).to.eventually.equal(1);
    });

    When('I click on the userbadge', function () {
        var element = $('.jw-user-badge');
        return element.click();
    });

    Then('the login modal should be visible', function () {
        var element = $('.jw-popup-login');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the modal title should be {stringInDoubleQuotes}', function (title) {
        var element = $('.jw-popup-title');
        return expect(element.getText()).to.eventually.equal(title);
    });

    Then('a {stringInDoubleQuotes} provider button is present', function (providerName) {
        var element = $('.jw-login-social-buttons .jw-button-' + providerName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} input field is present', function (inputFieldName) {
        var element = $('input.jw-form-control#' + inputFieldName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} button is present', function (buttonName) {
        var element = $('.jw-button-' + buttonName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    When('I click on the {stringInDoubleQuotes} button', function (buttonName) {
        var element = $('.jw-button-' + buttonName);
        return element.click();
    });

    Then('the signup modal should be visible', function () {
        var element = $('.jw-popup-signup');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Given('the signup modal is visible', function () {
        var element = $('.jw-popup-signup');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} checkbox is present', function (checkboxName) {
        var element = $('.jw-checkbox-' + checkboxName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    When('I focus on the {stringInDoubleQuotes} input', function (inputFieldName) {
        var element = $('input.jw-form-control#' + inputFieldName);
        return element.click();
    });

    When('I enter {stringInDoubleQuotes} in the {stringInDoubleQuotes} input', function (text, inputFieldName) {
        var element = $('input.jw-form-control#' + inputFieldName);
        return element.sendKeys(text);
    });

    When('I remove everything in the {stringInDoubleQuotes} input', function (inputFieldName) {
        var element = $('input.jw-form-control#' + inputFieldName);
        return element.clear();
    });

    Then('a warning should be visible with the text {stringInDoubleQuotes}', function (text) {
        var element = $$('.jw-form-group-warnings .jw-form-group-warning').get(0);
        return expect(element.getText()).to.eventually.equal(text);
    });

    When('I click on the terms checkbox', function () {
        var element = $('.jw-checkbox-terms');
        return element.click();
    });

    Then('The {stringInDoubleQuotes} button should be not disabled', function (buttonName) {
        var element = $('.jw-button-' + buttonName);
        return expect(element.isEnabled()).to.eventually.equal(true);
    });

    When('I click the signup button', function () {
        var element = $('.jw-button-signup');
        return element.click();
    });

    Then('an alert should be shown', function () {
        var element = $('.jw-popup-alert');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the text in the should be {stringInDoubleQuotes}', function (text) {
        var element = $('.jw-popup-alert .jw-popup-title');
        return expect(element.getText()).to.eventually.equal(text);
    });








});
