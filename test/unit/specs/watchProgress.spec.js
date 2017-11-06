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

describe('watchProgress', function () {

    var config   = getFixture('config/default'),
        feed     = getFixture('feed/lrYLc95e'),
        LjBvF1FX = getFixture('feed/LjBvF1FX'),
        Iyfst4Se = getFixture('feed/Iyfst4Se'),
        $timeout,
        $httpBackend,
        watchProgress,
        dataStore,
        FeedModel;

    function prepareLocalStorage (items) {
        window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify(items));
    }

    beforeEach(function () {
        module(
            'ngAnimate',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'jwShowcase.core'
        );
    });

    beforeEach(function () {

        module('jwShowcase.core', function ($provide) {
            $provide.constant('config', config);
        });

        inject(function (_$timeout_, _$httpBackend_, _watchProgress_, _dataStore_, _FeedModel_) {
            $timeout      = _$timeout_;
            $httpBackend  = _$httpBackend_;
            watchProgress = _watchProgress_;
            dataStore     = _dataStore_;
            FeedModel     = _FeedModel_;

            $httpBackend.whenGET(/.*\/media\/LjBvF1FX/).respond(LjBvF1FX);
            $httpBackend.whenGET(/.*\/media\/Iyfst4Se/).respond(Iyfst4Se);

            window.config = config;

            var model = new FeedModel('lrYLc95e');
            model.playlist = feed.playlist;

            dataStore.feeds.push(model);

            // clear all items in localStorage
            window.localStorage.clear();
        });
    });

    describe('restore()`', function () {

        it('should restore items from session', function () {

            $httpBackend.expectGET(/.*\/media\/LjBvF1FX/);
            $httpBackend.expectGET(/.*\/media\/Iyfst4Se/);

            prepareLocalStorage([
                { mediaid: 'LjBvF1FX', feedid: 'lrYLc95e', progress: 0.75, lastWatched: +new Date() },
                { mediaid: 'Iyfst4Se', feedid: 'lrYLc95e', progress: 0.75, lastWatched: +new Date() }
            ]);

            watchProgress.restore().then(function () {
                expect(dataStore.watchProgressFeed.playlist.length).toEqual(2);
            });

            $httpBackend.flush();
            $timeout.flush();
        });

        it('should not restore invalid items from session', function () {

            prepareLocalStorage([
                { feedid: 'lrYLc95e', progress: 0.75, lastWatched: +new Date() },
                { progress: 0.75, lastWatched: +new Date() }
            ]);

            watchProgress.restore().then(function () {
                expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
            });

            $timeout.flush();
        });

        it('should not restore items with wrong progress from session', function () {

            prepareLocalStorage([
                { mediaid: 'LjBvF1FX', feedid: 'lrYLc95e', progress: 0.09, lastWatched: +new Date() },
                { mediaid: 'Iyfst4Se', feedid: 'lrYLc95e', progress: 0.91, lastWatched: +new Date() }
            ]);

            watchProgress.restore().then(function () {
                expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
            });

            $timeout.flush();
        });

        it('should not restore items older than 30 days from session', function () {

            prepareLocalStorage([
                { mediaid: 'LjBvF1FX', feedid: 'lrYLc95e', progress: 0.75, lastWatched: +new Date() - 86400000 * 30 }
            ]);

            watchProgress.restore().then(function () {
                expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
            });

            $timeout.flush();
        });

        it('should sort items on lastWatched descending', function () {

            prepareLocalStorage([
                { mediaid: 'uNXCVIsW', feedid: 'lrYLc95e', progress: 0.5, lastWatched: +new Date() - 500 },
                { mediaid: 'LjBvF1FX', feedid: 'lrYLc95e', progress: 0.5, lastWatched: +new Date() },
                { mediaid: 'Iyfst4Se', feedid: 'lrYLc95e', progress: 0.5, lastWatched: +new Date() - 10 }
            ]);

            watchProgress.restore().then(function () {
                expect(dataStore.watchProgressFeed.playlist[0].mediaid).toEqual('LjBvF1FX');
                expect(dataStore.watchProgressFeed.playlist[1].mediaid).toEqual('Iyfst4Se');
                expect(dataStore.watchProgressFeed.playlist[2].mediaid).toEqual('uNXCVIsW');
            });

            $timeout.flush();
        });
    });

});
