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

    this.Given(/I have a saved watchProgress of 31 days old with mediaid "([^"]*)" and feedid "([^"]*)"/, function (mediaid, feedid, callback) {

        var data = [{
            mediaid:     mediaid,
            feedid:      feedid,
            progress:    0.5,
            lastWatched: +new Date() - (3600 * 24 * 1000 * 31)
        }];

        browser
            .addMockModule('app', function (watchProgress) {
                angular.module('app').run(function () {
                    window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify(watchProgress));
                });
            }, data);

        callback();
    });

    this.Given(/I have the following saved watch progress/, function (data, callback) {

        var hashes = data
            .hashes()
            .map(function (item) {

                item.progress = parseFloat(item.progress);

                if (item.lastWatched === 'now') {
                    item.lastWatched = +new Date();
                } else {
                    item.lastWatched = parseInt(item.lastWatched);
                }

                if (item.offset) {
                    item.lastWatched += parseInt(item.offset);
                }

                delete item.offset;

                return item;
            });

        browser
            .addMockModule('app', function (watchProgress) {
                window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify(watchProgress));
                angular.module('app').run(function () {
                    window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify(watchProgress));
                });
            }, hashes);

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

    this.Then(/the video progress of mediaid "([^"]*)" and feedid "([^"]*)" should not be saved/, function (mediaid, feedid, callback) {

        browser
            .executeScript(function () {
                return JSON.parse(window.localStorage.getItem('jwshowcase.watchprogress'));
            })
            .then(function (data) {
                expect((data || []).length).to.equal(0);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should not be visible/, function (callback) {

        browser
            .findElements(by.css('.watchProgress'))
            .then(function (elements) {
                expect(elements.length).to.equal(0);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should be visible/, function (callback) {

        browser
            .findElements(by.css('.watchProgress'))
            .then(function (elements) {
                expect(elements.length).to.equal(1);
                callback();
            });
    });

    this.Then(/the "Continue watching" slider should contain (\d+) cards/, function (count, callback) {

        browser
            .findElements(by.css('.watchProgress .jw-card'))
            .then(function (elements) {
                expect(elements.length).to.equal(parseInt(count));
                callback();
            });
    });

    this.Then(/the first card in "Continue watching" slider should have mediaid "([^"]*)"/, function (mediaid, callback) {

        element(by.css('.watchProgress .jw-card-slider-slide:first-child .jw-card')).evaluate('item').then(function (item) {
            expect(item.mediaid).to.equal(mediaid);
            callback();
        });
    });

    this.Then(/the first card in "Continue watching" slider should show "([^"]*)" watch progress/, function (width, callback) {

        element(by.css('.watchProgress .jw-card-slider-slide:first-child .jw-card .jw-card-watch-progress'))
            .getAttribute('style')
            .then(function (style) {
                expect(style).to.contains('width: ' + width);
                callback();
            });
    });

};

module.exports = stepsDefinition;