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

/* jshint esversion: 6 */
/* globals require, browser, angular, expect, $ */

const
    {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {

    Given('the login modal is visible', function () {
        let element = $('.jw-popup-login');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the userbadge should not be visible', function () {
        let element = $$('.jw-user-badge');
        return expect(element.count()).to.eventually.equal(0);
    });

    Then('the userbadge should be visible', function () {
        let element = $$('.jw-user-badge');
        return expect(element.count()).to.eventually.equal(1);
    });

    When('I click on the userbadge', function () {
        let element = $('.jw-user-badge');
        return element.click();
    });

    Then('the login modal should be visible', function () {
        let element = $('.jw-popup-login');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the modal title should be {stringInDoubleQuotes}', function (title) {
        let element = $('.jw-popup-title');
        return expect(element.getText()).to.eventually.equal(title);
    });

    Then('a {stringInDoubleQuotes} provider button is present', function (providerName) {
        let element = $('.jw-login-social-buttons .jw-button-' + providerName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} input field is present', function (inputFieldName) {
        let element = $('input.jw-form-control#' + inputFieldName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} button is present', function (buttonName) {
        let element = $('.jw-button-' + buttonName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    When('I click on the {stringInDoubleQuotes} button', function (buttonName) {
        let element = $('.jw-button-' + buttonName);
        return element.click();
    });

    Then('the signup modal should be visible', function () {
        let element = $('.jw-popup-signup');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Given('the signup modal is visible', function () {
        let element = $('.jw-popup-signup');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('a {stringInDoubleQuotes} checkbox is present', function (checkboxName) {
        let element = $('.jw-checkbox-' + checkboxName);
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    When('I focus on the {stringInDoubleQuotes} input', function (inputFieldName) {
        let element = $('input.jw-form-control#' + inputFieldName);
        return element.click();
    });

    When('I enter {stringInDoubleQuotes} in the {stringInDoubleQuotes} input', function (text, inputFieldName) {
        let element = $('input.jw-form-control#' + inputFieldName);
        return element.sendKeys(text);
    });

    When('I remove everything in the {stringInDoubleQuotes} input', function (inputFieldName) {
        let element = $('input.jw-form-control#' + inputFieldName);
        return element.clear();
    });

    Then('a warning should be visible with the text {stringInDoubleQuotes}', function (text) {
        let element = $$('.jw-form-group-warnings .jw-form-group-warning').get(0);
        return expect(element.getText()).to.eventually.equal(text);
    });

    When('I click on the terms checkbox', function () {
        let element = $('.jw-checkbox-terms');
        return element.click();
    });

    Then('The {stringInDoubleQuotes} button should be not disabled', function (buttonName) {
        let element = $('.jw-button-' + buttonName);
        return expect(element.isEnabled()).to.eventually.equal(true);
    });

    When('I click the signup button', function () {
        let element = $('.jw-button-signup');
        return element.click();
    });

    Then('an alert should be shown', function () {
        let element = $('.jw-popup-alert');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the text in the alert should be {stringInDoubleQuotes}', function (text) {
        let element = $('.jw-popup-alert .jw-popup-title');
        return expect(element.getText()).to.eventually.equal(text);
    });

    Then('click on the alert confirmation button', function () {
        let element = $('.jw-popup-alert .jw-button-primary');
        return element.click();
    });

    When('I click the login button', function () {
        let element = $('.jw-button-login');

        return element.click();
    });

    Then('the userbadge dropdown should show', function () {
        let element = $('.jw-user-info-dropdown');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the userbadge dropdown name is {stringInDoubleQuotes}', function (name) {
        let element = $('.jw-user-info-dropdown .jw-user-info-dropdown-name');
        return expect(element.getText()).to.eventually.equal(name);
    });

    Then('the userbadge dropdown email is {stringInDoubleQuotes}', function (email) {
        let element = $('.jw-user-info-dropdown .jw-user-info-dropdown-email');
        return expect(element.getText()).to.eventually.equal(email);
    });

    Then('the userbadge has a account info button', function () {
        let element = $('.jw-user-info-dropdown .jw-user-info-dropdown-info');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('the userbadge has a logout button', function () {
        let element = $('.jw-user-info-dropdown .jw-user-info-dropdown-log-out');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    When('I click the account-info button', function () {
        let element = $('.jw-user-info-dropdown .jw-user-info-dropdown-info');
        return element.click();
    });

    Then('the account info modal should be visible', function () {
        let element = $('.jw-popup-account-info');
        return expect(element.isDisplayed()).to.eventually.equal(true);
    });

    Then('an error with {stringInDoubleQuotes}', function (errorText) {
        let element = $('.jw-errors-row');
        return expect(element.getText()).to.eventually.equal(errorText);
    });

});
