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

    Given('I scroll to the next up slider', function () {
        return scrollToElement($('.jw-card-slider[feed="vm.activeFeed"]'));
    });

    Given('I scroll to the related videos slider', function () {
        return scrollToElement($('.jw-card-slider[feed="vm.extraFeed"]'));
    });

    //
    // When steps
    //

    When('I wait until the video is loaded', function () {
        return browser.wait(function () {
            return $('body').isElementPresent(by.css('.jw-preview'));
        });
    });

    When('I start video playback', function () {
        return browser.executeScript('jwplayer().play()');
    });

    When('I wait until the video is playing', function () {
        return browser.wait(function () {
            return browser.executeScript('return jwplayer().getState()').then(function (state) {
                return state === 'playing';
            });
        });
    });

    When('I start playing the next playlist item', function () {
        return browser.executeScript('jwplayer().playlistNext()');
    });

    When('I click on the {ordinal} visible card in the next up slider', function (num) {
        const cardElement = $$('.jw-card-slider[feed="vm.activeFeed"] .jw-card-slider-slide.is-visible .jw-card')
            .get(num - 1);

        // safari does not trigger an actual click on the first click command
        if (this.browserName === 'safari') {
            return cardElement.click().click();
        }

        return cardElement.click();
    });

    When('I expand the video description', function () {
        return $$('.jw-collapsible-text-toggle .jw-button').then(function (elements) {
            // optional, toggle button could be hidden
            if (elements[0]) {
                return elements[0].click();
            }
        });
    });

    When('I click the first video tag', function () {
        return $$('.jw-video-details-tag').get(0).click();
    });

    When('I seek to the end of video', function () {
        return browser.executeScript('jwplayer().seek(jwplayer().getDuration() - 2)');
    });

    When('I scroll to the video description', function () {
        return scrollToElement($('.jw-collapsible-text-toggle'));
    });

    //
    // Then steps
    //

    Then('the video should be playing', function () {
        return expect(browser.executeScript('return jwplayer().getState()'))
            .to.eventually.match(/playing|buffering/);
    });

    Then('the play icon should be visible', function () {
        return expect($('.jw-display-icon-container .jw-icon-display').isDisplayed()).to.eventually.equal(true);
    });

    Then('the video title is {stringInDoubleQuotes}', function (title) {
        function trim (text) {
            return text.replace(/\s/g, '');
        }

        title = trim(title);

        return expect($('.jw-video-details .jw-video-details-title').getText().then(trim)).to.eventually.equal(title);
    });

    Then('the video title is above the video', function () {
        return expect($$('.jw-video-details-flag-above .jw-video-details-title').count()).to.eventually
            .equal(1);
    });

    Then('the video description is:', function (description) {
        return expect($('.jw-video-details .jw-video-details-description .jw-markdown').getText()).to.eventually
            .equal(description);
    });

    Then('the video duration label is {stringInDoubleQuotes}', function (duration) {
        return expect($('.jw-video-details .jw-video-details-duration').getText()).to.eventually.equal(duration);
    });

    Then('the next up title is shown', function () {
        return expect($('.jw-card-slider[feed="vm.activeFeed"] .jw-feed-title').isDisplayed()).to.eventually
            .equal(true);
    });

    Then('the related videos title is shown', function () {
        return expect($('.jw-card-slider[feed="vm.extraFeed"] .jw-feed-title').isDisplayed()).to.eventually
            .equal(true);
    });

    Then('the video tags should be visible', function () {
        return expect($$('.jw-video-details-tag').get(0).isDisplayed()).to.eventually.equal(true);
    });

    Then('the player should get pinned', function () {
        return expect($('.jw-video-container-player').getAttribute('class')).to.eventually.contain('is-pinned');
    });

    Then('the player should get unpinned', function() {
        return expect($('.jw-video-container-player').getAttribute('class')).to.eventually.not.contain('is-pinned');
    });

    Then('the player should stick', function () {
        return expect($('.jw-video-container-player').getAttribute('class')).to.eventually.contain('is-stuck');
    });

    Then('the player should unstick', function () {
        return expect($('.jw-video-container-player').getAttribute('class')).to.eventually.not.contain('is-stuck');
    });

    Then('the sticky player should activate', function () {
        return expect($('.jw-mobile-player-container').getAttribute('class')).to.eventually.not.contain('is-pinned');
    });

    Then('the sticky player should deactivate', function () {
        return expect($('.jw-mobile-player-container').getAttribute('class')).to.eventually.not.contain('is-pinned');
    });

});
