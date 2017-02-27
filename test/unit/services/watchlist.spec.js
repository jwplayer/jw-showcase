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

describe('Service: watchlist', function () {

    var feedFixture  = getFixture('feed/lrYLc95e'),
        itemFixture  = feedFixture.playlist[0],
        itemFixture2 = feedFixture.playlist[1],
        watchlist, dataStore;

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_watchlist_, _dataStore_) {

        watchlist = _watchlist_;
        dataStore = _dataStore_;

        // clear all
        window.localStorage.clear();
        window.localStorageSupport = true;
    }));

    describe('when using `addItem`', function () {

        it('should be able to add an item', function () {
            watchlist.addItem(itemFixture);
            expect(watchlist.hasItem(itemFixture)).toBeTruthy();
        });

        it('should be able to add multiple items', function () {
            watchlist.addItem(itemFixture);
            watchlist.addItem(itemFixture2);

            expect(watchlist.hasItem(itemFixture)).toBeTruthy();
            expect(watchlist.hasItem(itemFixture2)).toBeTruthy();
        });

        it('should update the dataStore watchlist feed', function () {
            watchlist.addItem(itemFixture);
            expect(dataStore.watchlistFeed.playlist.length).toEqual(1);
            expect(dataStore.watchlistFeed.playlist[0].mediaid).toEqual(itemFixture.mediaid);
        });
    });

    describe('when using `removeItem`', function () {

        it('should be able to remove an item', function () {
            watchlist.addItem(itemFixture);
            expect(watchlist.hasItem(itemFixture)).toBeTruthy();
            watchlist.removeItem(itemFixture);
            expect(watchlist.hasItem(itemFixture)).toBeFalsy();
        });

        it('should remove the item from the dataStore watchlist feed', function () {
            watchlist.addItem(itemFixture);
            expect(dataStore.watchlistFeed.playlist.length).toEqual(1);
            watchlist.removeItem(itemFixture);
            expect(dataStore.watchlistFeed.playlist.length).toEqual(0);
        });
    });

    describe('when using `clearAll`', function () {

        it('should be able clear all items', function () {
            watchlist.addItem(itemFixture);
            watchlist.addItem(itemFixture2);
            expect(watchlist.hasItem(itemFixture)).toBeTruthy();
            expect(watchlist.hasItem(itemFixture2)).toBeTruthy();
            watchlist.clearAll();
            expect(watchlist.hasItem(itemFixture)).toBeFalsy();
            expect(watchlist.hasItem(itemFixture2)).toBeFalsy();
        });

        it('should clear all items in the dataStore watchlist feed', function () {
            watchlist.addItem(itemFixture);
            watchlist.addItem(itemFixture2);
            expect(dataStore.watchlistFeed.playlist.length).toEqual(2);
            watchlist.clearAll();
            expect(dataStore.watchlistFeed.playlist.length).toEqual(0);
        });
    });

    describe('when using `restore`', function () {

        it('should be able restore items from localStorage', function () {
            dataStore.feeds.push(feedFixture);
            itemFixture.feedid = feedFixture.feedid;
            window.localStorage.setItem('jwshowcase.watchlist', '[{"mediaid": "' + itemFixture.mediaid + '", "feedid": "' + itemFixture.feedid + '"}]');
            watchlist.restore();
            expect(watchlist.hasItem(itemFixture)).toBeTruthy();
        });
    });
});