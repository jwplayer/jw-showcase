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

    When('I scroll to the continue watching slider', function () {
        return scrollToElement($('.jw-content-row-continue-watching'));
    });

    //
    // Then steps
    //

    Then('the continue watching slider should be hidden', function () {
        return expect($('.jw-content-row-continue-watching').isElementPresent(by.css('.jw-card-slider')))
            .to.eventually.equal(false);
    });

    Then('the continue watching slider should be visible', function () {
        return expect($('.jw-content-row-continue-watching').isElementPresent(by.css('.jw-card-slider')))
            .to.eventually.equal(true);
    });

    Then('the continue watching slider should contain {int} items', function (num) {
        return expect($$('.jw-content-row-continue-watching .jw-card').count())
            .to.eventually.equal(num);
    });

    Then('the video progress of mediaid {string} and feedid {string} should be saved', function (mediaid, feedid) {
        return browser
            .executeScript('return window.localStorage.getItem("jwshowcase.watchprogress")')
            .then(function (rawData) {
                var data = JSON.parse(rawData);
                expect(data).to.be.an('array');
                expect(data.find((current) => current.mediaid === mediaid && current.feedid === feedid)).to.be.defined;
            });
    });

    Then('the video progress of mediaid {string} and feedid {string} should not be saved', function (mediaid, feedid) {
        return browser
            .executeScript('return window.localStorage.getItem("jwshowcase.watchprogress")')
            .then(function (rawData) {
                var data = JSON.parse(rawData);
                expect(data).to.be.an('array');
                expect(data.find((current) => current.mediaid === mediaid && current.feedid === feedid)).to.not.be.defined;
            });
    });

    Then('the {ordinal} card in the continue watching slider should have mediaid {string}', function (num, mediaid) {
        return expect($$('.jw-content-row-continue-watching .jw-card').get(num - 1).evaluate('item.mediaid'))
            .to.eventually.equal(mediaid);
    });

    Then('the {ordinal} card in the continue watching slider should show {int}% watch progress', function (num, percentage) {
        return expect($$('.jw-content-row-continue-watching .jw-card').get(num - 1).$('.jw-card-watch-progress').getAttribute('style'))
            .to.eventually.contains(`width: ${percentage}%`);
    });

    Then('the video progress should be greater than {int}%', function (progress) {
        return expect(browser.executeScript('return (jwplayer().getPosition() / jwplayer().getDuration()) * 100;'))
            .to.eventually.be.greaterThan(progress);
    });

});
