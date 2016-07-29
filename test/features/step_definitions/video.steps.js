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
            .waitForAngular()
            .then(function () {
                browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
                browser
                    .findElement(by.css('.jw-display-icon-container'))
                    .click()
                    .then(function () {
                        browser.sleep(2000);
                        callback();
                    });
            });
    });

    this.When(/^I click on the playing video$/, function (callback) {
        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jwplayer'))
                    .click()
                    .then(function () {
                        callback();
                    });
            });
    }); // call

    this.When(/^I click on the navigate back chevron$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jw-button-back'))
                    .click()
                    .then(function () {
                        browser.sleep(2000);
                        callback();
                    });

            });
    }); // case

    this.When(/^I click on the mobile video viewport$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('video'))
                    .click()
                    .then(function () {
                        callback();
                    });
            });
    }); // case

    this.When(/^I wait until the overlay disappears$/, function (callback) {

        browser
            .sleep(5000)
            .then(function () {
                callback();
            });
    });

    this.Then(/^the 404 page should be visible$/, function (callback) {

        browser
            .getCurrentUrl()
            .then(function (url) {
                expect(url).to.equal(browser.baseUrl + '/404');
                callback();
            });
    });

    this.Then(/^I move my mouse over the video$/, function (callback) {

        if ('safari' === browser.browserName) {
            return callback(null, 'pending');
        }

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jwplayer'))
                    .then(function (el) {

                        browser
                            .actions()
                            .mouseMove(el)
                            .perform()
                            .then(function () {
                                browser.sleep(2000);
                                callback();
                            });
                    });
            });
    });

    this.Then(/^the video exists$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jw-meta > .jw-meta-title'))
                    .getText()
                    .then(function (txt) {
                        expect('This video doesn\'t exist').to.not.eql(txt.trim());
                        callback();
                    });
            });
    }); // case

    this.Then(/^the "([^"]*)" share button should contain the correct href$/, function (type, callback) {

        var elementIndex = type === 'facebook' ? 0 : 1,
            url          = type === 'facebook' ? FACEBOOK_SHARE_URL : TWITTER_SHARE_URL;

        browser
            .findElements(by.css('.jw-button-share'))
            .then(function (elements) {

                elements[elementIndex]
                    .getAttribute('href')
                    .then(function (elementHref) {
                        expect(elementHref).to.contain(url);
                        callback();
                    });
            });
    }); //case

    this.Then(/^the index loads$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .getCurrentUrl()
                    .then(function (currentUrl) {
                        expect(currentUrl).to.equal(browser.baseUrl + '/');
                        callback();
                    });
            });

    }); // case

    this.Then(/^the related videos title is shown$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jw-card-slider-title'))
                    .getAttribute('innerText')
                    .then(function (txt) {
                        expect(txt).to.equal('More like this (7)');
                        callback();
                    });
            });

    }); // case

    this.Then(/^the video description should show the duration$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .findElement(by.css('.jw-meta > .jw-meta-duration > span'))
                    .getText()
                    .then(function (txt) {
                        var text = txt.split(' ');
                        expect(text[1]).to.equal('min');
                        expect(text[0]).not.to.be.NaN;
                        callback();
                    });

            });

    }); // case

    this.Then(/^the play icon should be visible$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                setTimeout(function () {
                    browser
                        .findElement(by.css('.jw-display-icon-container'))
                        .findElement(by.css('.jw-icon-display'))
                        .isDisplayed()
                        .then(function (isDisplayed) {
                            expect(isDisplayed).to.equal(true);
                            callback();
                        });
                }, 1000);
            });

    }); // case


    this.Then(/^the video title and description should be visible over the video$/, function (callback) {

        browser
            .findElement(by.css('.jw-jumbotron'))
            .getSize()
            .then(function (size) {
                browser
                    .findElement(by.css('.jw-meta'))
                    .getLocation()
                    .then(function (location) {
                        expect(location.x).to.be.lessThan(size.height);
                        callback();
                    });
            });
    }); // case

    this.Then(/^the video title and description should be visible below the video$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {

                browser
                    .findElement(by.css('video.jw-video'))
                    .getSize()
                    .then(function (size) {
                        browser
                            .findElement(by.css('.jw-meta'))
                            .getLocation()
                            .then(function (location) {
                                expect(Math.round(size.height)).to.equal(Math.round(location.y));
                                callback();
                            });
                    });
            });

    }); // case


    this.Then(/^the video should be paused$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .executeScript(function () {
                        return jwplayer().getState();
                    })
                    .then(function (state) {
                        expect(state).to.equal('paused');
                        callback();
                    });
            });

    }); // case

    this.Then(/^the video should be playing$/, function (callback) {

        browser
            .waitForAngular()
            .then(function () {
                browser
                    .executeScript(function () {
                        return jwplayer().getState();
                    })
                    .then(function (state) {
                        expect(state).to.match(/^playing|buffering/);
                        callback();
                    });
            });

    }); // case

    this.Then(/^the video overlay disappears after "([^"]*)" seconds$/, function (secs, callback) {

        var runTime = (parseInt(secs) + 1) * 1000;

        expect(secs).to.be.greaterThan(0);

        browser
            .sleep(runTime)

        browser
            .findElement(by.css('.jw-meta'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(false);
                callback();
            });

    }); // case
};

module.exports = stepsDefinition;
