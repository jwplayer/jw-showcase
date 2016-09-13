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

var FACEBOOK_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php';
var TWITTER_SHARE_URL  = 'http://twitter.com/share';

var stepsDefinition = function () {

    this.When(/^I click on the play video icon$/, function (callback) {

        browser
            .executeScript('window.scrollTo(0,document.body.scrollHeight);');

        browser
            .findElement(by.css('.jw-display-icon-container'))
            .click()
            .then(delay(callback, 2000));
    });

    this.When(/^I click on the playing video$/, function (callback) {

        browser
            .findElement(by.css('.jwplayer'))
            .click()
            .then(callback);
    });

    this.When(/^I click on the navigate back chevron$/, function (callback) {

        browser
            .findElement(by.css('.jw-button-back'))
            .click()
            .then(delay(callback, 2000));
    });

    this.When(/^I click on the mobile video viewport$/, function (callback) {

        browser
            .findElement(by.css('video'))
            .click()
            .then(callback);
    });

    this.When(/^I wait until the overlay disappears$/, function (callback) {

        browser
            .sleep(5000)
            .then(callback);
    });

    this.When(/^I wait until the video starts playing$/, function (callback) {

        browser
            .executeAsyncScript(function (callback) {
                var called = false;
                jwplayer().on('time', function (evt) {
                    if (!called && evt.position > 2) {
                        called = true;
                        callback();
                    }
                });
            })
            .then(callback);
    });

    this.Then(/^the 404 page should be visible$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (url) {
                expect(url).to.equal(browser.baseUrl + '/404');
                callback();
            });
    });

    this.Then(/^seek to the end of video$/, function (callback) {

        browser
            .executeScript(function () {
                jwplayer().seek(jwplayer().getDuration());
            })
            .then(callback);
    });

    this.Then(/^I move my mouse over the video$/, function (callback) {

        if ('safari' === browser.browserName) {
            return callback(null, 'pending');
        }

        element(by.css('.jwplayer'))
            .actions()
            .mouseMove(el)
            .perform()
            .then(delay(callback, 2000));
    });

    this.Then(/^the video player is ready$/, function (callback) {

        browser
            .executeScript(function () {
                return jwplayer().getState();
            })
            .then(function (state) {
                expect(state).to.equal('idle');
                callback();
            });
    });

    this.Then(/^the "([^"]*)" share button should contain the correct href$/, function (type, callback) {

        var nth = 'facebook' ? 1 : 2,
            url = 'facebook' ? FACEBOOK_SHARE_URL : TWITTER_SHARE_URL;

        browser
            .findElement(by.css('.jw-button-share:nth-child(' + nth + ')'))
            .getAttribute('href')
            .then(function (elementHref) {
                expect(elementHref).to.contain(url);
                callback();
            });
    });

    this.Then(/^the index loads$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {
                expect(currentUrl).to.equal(browser.baseUrl + '/');
                callback();
            });
    });

    this.Then(/^the related videos title is shown$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-title'))
            .getAttribute('innerText')
            .then(function (txt) {
                expect(txt.trim()).to.equal('More like this (7)');
                callback();
            });
    });

    this.Then(/^the video description should show the duration$/, function (callback) {

        browser
            .findElement(by.css('.jw-meta .jw-meta-duration'))
            .getText()
            .then(function (txt) {
                var text = txt.trim().split(' ');
                expect(text[1]).to.equal('min');
                expect(text[0]).not.to.be.NaN;
                callback();
            });
    });

    this.Then(/^the play icon should be visible$/, function (callback) {

        browser
            .sleep(1000);

        browser
            .findElement(by.css('.jw-display-icon-container'))
            .findElement(by.css('.jw-icon-display'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the video title and description should be visible$/, function (callback) {

        browser
            .findElement(by.css('.jw-meta'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the video should be paused$/, function (callback) {

        browser
            .executeScript(function () {
                return jwplayer().getState();
            })
            .then(function (state) {
                expect(state).to.match(/^paused|idle/);
                callback();
            });
    });

    this.Then(/^the video should be playing$/, function (callback) {

        browser
            .executeScript(function () {
                return jwplayer().getState();
            })
            .then(function (state) {
                expect(state).to.match(/^playing|buffering/);
                callback();
            });
    });

    this.Then(/^the video progress should be greater than (\d+)%$/, function (progress, callback) {

        progress = parseInt(progress) / 100;

        browser
            .executeScript(function () {
                return jwplayer().getPosition() / jwplayer().getDuration();
            })
            .then(function (currentProgress) {
                expect(currentProgress).to.be.greaterThan(progress);
                callback();
            });
    });
};

module.exports = stepsDefinition;
