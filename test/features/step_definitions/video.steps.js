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
var EMAIL_SHARE_URL    = 'mailto:';

var stepsDefinition = function () {

    this.When(/^I scroll to the related slider$/, function (callback) {

        scrollToElement('.jw-row[ng-if="vm.recommendationsFeed"]')
            .then(callback);
    });

    this.When(/^I start video playback$/, function (callback) {

        browser
            .findElement(by.css('.jwplayer'))
            .getAttribute('class')
            .then(function (className) {

                if (className.indexOf('jw-flag-touch') !== -1) {
                    return browser
                        .touchActions()
                        .tap(element(by.css('.jwplayer .jw-video')))
                        .perform()
                        .then(delay(callback, 2000));
                }

                browser
                    .findElement(by.css('.jwplayer .jw-icon-display'))
                    .click()
                    .then(delay(callback, 2000));
            });
    });

    this.When(/^I click on the mobile video viewport$/, function (callback) {

        browser
            .findElement(by.css('video'))
            .click()
            .then(callback);
    });

    this.When(/^I click on the (\d+)(?:st|nd|rd|th) visible card in the more like this slider$/, function (num, callback) {

        browser
            .findElements(by.css('.jw-card-slider[feed="vm.feed"] .jw-card-slider-slide.is-visible'))
            .then(function (elements) {

                if (!elements[num - 1]){
                    callback();
                }

                elements[num - 1]
                    .click()
                    .then(callback);
            });
    });

    this.When(/^I start playing the next playlist item$/, function (callback) {

        browser
            .executeScript(function () {
                jwplayer().playlistNext();
            })
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
                jwplayer().on('time', function onTime (evt) {
                    if (evt.position > 1) {
                        jwplayer().off('time', onTime);
                        callback();
                    }
                });
            })
            .then(callback);
    });

    this.When(/^I scroll to the more like this slider$/, function (callback) {

        scrollToElement('.jw-card-slider[feed="vm.feed"]')
            .then(callback);
    });

    this.When(/^I seek to the end of video$/, function (callback) {

        browser
            .executeScript(function () {
                jwplayer().seek(jwplayer().getDuration());
            })
            .then(callback);
    });

    this.When(/^I seek to (\d+) seconds/, function (position, callback) {

        browser
            .executeScript(function (pos) {
                jwplayer().seek(pos);
            }, [position])
            .then(callback);
    });

    this.Then(/^the video not found page should be visible$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (url) {
                expect(url).to.equal(browser.baseUrl + '/video-not-found');
                callback();
            });
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

    this.Then(/^the index loads$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (currentUrl) {
                expect(currentUrl).to.equal(browser.baseUrl + '/');
                callback();
            });
    });

    this.Then(/^the related videos title is shown$/, function (callback) {

        scrollToElement('.jw-row[ng-if="vm.feed"]')
            .then(function () {
                browser
                    .findElement(by.css('.jw-row[ng-if="vm.feed"]'))
                    .findElement(by.css('.jw-card-slider-flag-default'))
                    .findElement(by.css('.jw-card-slider-title'))
                    .getText()
                    .then(function (title) {

                        // title can contain an icon and multiple whitespaces
                        title = title
                            .replace(/\s{2,}/g, ' ')
                            .trim();

                        expect(title).to.equal('More like this (9)');
                        callback();
                    });
            });
    });

    this.Then(/^the video details should show the duration$/, function (callback) {

        browser
            .findElement(by.css('.jw-video-details .jw-video-duration'))
            .getText()
            .then(function (txt) {
                var text = txt.trim().split(' ');
                expect(text[1]).to.equal('min');
                expect(isNaN(text[0])).to.equal(false);
                callback();
            });
    });

    this.Then(/^the play icon should be visible$/, function (callback) {

        browser
            .findElement(by.css('.jw-display-icon-container .jw-icon-display'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the video title and description should be visible$/, function (callback) {

        browser
            .findElement(by.css('.jw-video-details'))
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
