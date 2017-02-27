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

describe('Service: watchProgress', function () {

    var feedFixture  = getFixture('feed/lrYLc95e'),
        itemFixture  = feedFixture.playlist[0],
        itemFixture2 = feedFixture.playlist[1],
        watchProgress, dataStore;

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_watchProgress_, _dataStore_) {

        watchProgress = _watchProgress_;
        dataStore     = _dataStore_;

        // clear all
        window.localStorage.clear();
        window.localStorageSupport = true;
    }));

    describe('when using `saveItem`', function () {

        it('should be able to save a new item progress', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
        });

        it('should be able to save an existing item progress', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            expect(watchProgress.getItem(itemFixture).progress).toEqual(0.5);
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(1);
            watchProgress.saveItem(itemFixture, 0.6);
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            expect(watchProgress.getItem(itemFixture).progress).toEqual(0.6);
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(1);
        });
    });

    describe('when using `removeItem`', function () {

        it('should be able to remove an item', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            watchProgress.removeItem(itemFixture);
            expect(watchProgress.hasItem(itemFixture)).toBeFalsy();
        });

        it('should remove the item from the dataStore watchProgress feed', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(1);
            watchProgress.removeItem(itemFixture);
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
        });
    });

    describe('when using `clearAll`', function () {

        it('should be able clear all items', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            watchProgress.saveItem(itemFixture2, 0.6);
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            expect(watchProgress.hasItem(itemFixture2)).toBeTruthy();
            watchProgress.clearAll();
            expect(watchProgress.hasItem(itemFixture)).toBeFalsy();
            expect(watchProgress.hasItem(itemFixture2)).toBeFalsy();
        });

        it('should clear all items in the dataStore watchProgress feed', function () {
            watchProgress.saveItem(itemFixture, 0.5);
            watchProgress.saveItem(itemFixture2, 0.6);
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(2);
            watchProgress.clearAll();
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
        });
    });

    describe('when using `restore`', function () {

        it('should be able restore items from localStorage', function () {
            dataStore.feeds.push(feedFixture);
            itemFixture.feedid = feedFixture.feedid;
            window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify([{
                progress:    0.5,
                lastWatched: +new Date(),
                mediaid:     itemFixture.mediaid,
                feedid:      itemFixture.feedid
            }]));
            watchProgress.restore();
            expect(watchProgress.hasItem(itemFixture)).toBeTruthy();
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(1);
        });

        it('should not restore items from localStorage if lastWatched is older than 30 days', function () {
            dataStore.feeds.push(feedFixture);
            itemFixture.feedid = feedFixture.feedid;
            window.localStorage.setItem('jwshowcase.watchprogress', JSON.stringify([{
                progress:    0.5,
                lastWatched: +new Date() - (86400000 * 31),
                mediaid:     itemFixture.mediaid,
                feedid:      itemFixture.feedid
            }]));
            watchProgress.restore();
            expect(watchProgress.hasItem(itemFixture)).toBeFalsy();
            expect(dataStore.watchProgressFeed.playlist.length).toEqual(0);
        });
    });
});