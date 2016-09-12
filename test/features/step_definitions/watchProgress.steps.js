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

    /**
     * Save watchProgress in localStorage
     * @param mediaid
     * @param feedid
     * @param progress
     * @param lastWatched
     * @param callback
     */
    function saveWatchProgress (mediaid, feedid, progress, lastWatched, callback) {

        browser
            .executeScript(function (mediaid, feedid, progress, lastWatched, offset) {

                lastWatched = lastWatched == 'now' ? +new Date() : lastWatched;
                offset      = parseInt(offset) || 0;

                if (offset !== 0) {
                    lastWatched += offset;
                }

                var watchProgress       = JSON.parse(window.localStorage.getItem('jwshowcase.watchprogress')) || [];
                var watchProgressConcat = watchProgress.concat([{
                    mediaid:     mediaid,
                    feedid:      feedid,
                    progress:    progress,
                    lastWatched: lastWatched
                }]);

                window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify(watchProgressConcat));

            }, mediaid, feedid, progress, lastWatched)
            .then(function () {
                callback && callback();
            });
    }

    this.Given(/I have a saved watchProgress of 31 days old with mediaid "([^"]*)" and feedid "([^"]*)"/, function (mediaid, feedid, callback) {

        var lastWatched = +new Date() - (3600 * 24 * 1000 * 31);

        saveWatchProgress(mediaid, feedid, 0.5, lastWatched, callback);
    });

    this.Given(/I have the following saved watch progress/, function (data, callback) {

        data.hashes().forEach(function (data) {
            saveWatchProgress(data.mediaid, data.feedid, data.progress, data.lastWatched)
        });

        callback();
    });

    this.Then(/I log the watchProgress/, function () {

        browser
            .executeScript(function () {
                return JSON.parse(window.localStorage.getItem('jwshowcase.watchprogress'));
            })
            .then(function (data) {
                console.log(data);
            });
    });

    this.Then(/the video progress of mediaid "([^"]*)" and feedid "([^"]*)" should be saved/, function (mediaid, feedid, callback) {

        browser
            .executeScript(function () {
                return JSON.parse(window.localStorage.getItem('jwshowcase.watchprogress'));
            })
            .then(function (data) {

                var minTime = +new Date() - 10000;

                expect(data[0].mediaid).to.equal(mediaid);
                expect(data[0].feedid).to.equal(feedid);
                expect(data[0].lastWatched).to.be.greaterThan(minTime);
                expect(data[0].progress).to.be.greaterThan(0);
                expect(data[0].progress).to.be.lessThan(1);

                callback();
            });
    });

    this.Then(/the video progress of mediaid "([^"]*)" and feedid "([^"]*)" should be removed/, function (mediaid, feedid, callback) {

        browser
            .executeScript(function () {
                return JSON.parse(window.localStorage.getItem('jwshowcase.watchprogress'));
            })
            .then(function (data) {
                expect(data.length).to.equal(0);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should not be visible/, function (callback) {

        browser
            .findElements(by.css('.jw-row.watchProgress'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should be visible/, function (callback) {

        browser
            .findElements(by.css('.jw-row.watchProgress'))
            .then(function (elements) {
                expect(elements.length).to.equal(1);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should contain (\d+) cards/, function (count, callback) {

        browser
            .findElements(by.css('.jw-row.watchProgress .jw-card'))
            .then(function (elements) {
                expect(elements.length).to.equal(parseInt(count));
                callback();
            });
    });

    this.Then(/the first card in "Continue watching" slider should have mediaid "([^"]*)"/, function (mediaid, callback) {

        element(by.css('.jw-row.watchProgress .jw-card:first-child')).evaluate('item').then(function (item) {
            expect(item.mediaid).to.equal(mediaid);
            callback();
        });
    });

    this.Then(/the first card in "Continue watching" slider should show "([^"]*)" watch progress/, function (width, callback) {

        element(by.css('.jw-row.watchProgress .jw-card:first-child .jw-card-watch-progress-indicator'))
            .getAttribute('style')
            .then(function (style) {
                expect(style).to.contains('width: ' + width);
                callback();
            });
    });

};

module.exports = stepsDefinition;