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

describe('Service: api', function () {

    var feedFixture                = getFixture('feed/WXu7kuaW'),
        searchFeedFixture          = getFixture('feed/searchFeed'),
        emptySearchFeedFixture     = getFixture('feed/emptySearchFeed'),
        recommendationsFeedFixture = getFixture('feed/recommendationsFeed'),
        api, config, $httpBackend, $timeout;

    function notToBeCalled () {
        throw new Error('This function should not be called');
    }

    beforeEach(function () {
        module('jwShowcase.core');
    });

    injectConfig();

    beforeEach(inject(function ($injector, _api_, _config_) {
        api          = _api_;
        config       = _config_;
        $httpBackend = $injector.get('$httpBackend');
        $timeout     = $injector.get('$timeout');
    }));

    describe('when using `getFeed`', function () {

        var request;

        beforeEach(function () {

            request = $httpBackend
                .expectGET(config.contentService + '/v2/playlists/WXu7kuaW')
                .respond(200, feedFixture);
        });

        it('should resolve with a feed', function () {

            api.getFeed('WXu7kuaW').then(function (feed) {
                expect(feed).toBeDefined();
                expect(feed.feedid).toEqual('WXu7kuaW');
            });

            $httpBackend.flush();
        });

        it('should reject when given empty feedId', function () {

            api.getFeed('').then(null, function (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('feedId is not given or not a string');
            });

            $timeout.flush();
        });

        it('should fix all item urls', function () {

            api.getFeed('WXu7kuaW').then(function (feed) {
                expect(feed.playlist[0].image).toMatch(/^http/);
                expect(feed.playlist[0].sources[0].file).toMatch(/^http/);
                expect(feed.playlist[0].tracks[0].file).toMatch(/^http/);
            });

            $httpBackend.flush();
        });

        it('should reject when API returns 404 response', function () {

            request.respond(404);

            api.getFeed('WXu7kuaW').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message)
                    .toEqual('Feed with url `https://content.jwplatform.com/v2/playlists/WXu7kuaW` does not exist');
            });

            $httpBackend.flush();
        });

    });

    describe('when using `getSearchFeed`', function () {

        var request;

        beforeEach(function () {

            request = $httpBackend
                .expectGET(config.contentService + '/v2/playlists/r3MhKJyA?search=man')
                .respond(200, searchFeedFixture);
        });

        it('should resolve with a feed', function () {

            api.getSearchFeed('r3MhKJyA', 'man').then(function (feed) {
                expect(feed).toBeDefined();
                expect(feed.playlist.length).toEqual(2);
            });

            $httpBackend.flush();
        });

        it('should resolve with a empty search feed', function () {

            request.respond(200, emptySearchFeedFixture);

            api.getSearchFeed('r3MhKJyA', 'man').then(function (feed) {
                expect(feed).toBeDefined();
                // playlist key is missing in empty responses
                expect(feed.playlist).toBeDefined();
            });

            $httpBackend.flush();
        });

        it('should reject when given empty searchPlaylist', function () {

            api.getSearchFeed('', 'man').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('searchPlaylist is missing');
            });

            $timeout.flush();
        });

        it('should reject when given empty phrase', function () {

            api.getSearchFeed('r3MhKJyA', '').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('search phrase is not given or not a string');
            });

            $timeout.flush();
        });

        it('should fix all item urls', function () {

            api.getSearchFeed('r3MhKJyA', 'man').then(function (feed) {
                expect(feed.playlist[0].image).toMatch(/^http/);
                expect(feed.playlist[0].sources[0].file).toMatch(/^http/);
                expect(feed.playlist[0].tracks[0].file).toMatch(/^http/);
            });

            $httpBackend.flush();
        });

        it('should reject when API returns 404 response', function () {

            request.respond(404);

            api.getSearchFeed('r3MhKJyA', 'man').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message)
                    .toEqual('Feed with url `https://content.jwplatform.com/v2/playlists/r3MhKJyA?search=man` does not exist');
            });

            $httpBackend.flush();
        });

    });

    describe('when using `getRecommendationsFeed`', function () {

        var request;

        beforeEach(function () {

            request = $httpBackend
                .expectGET(config.contentService + '/v2/playlists/wZuMVmMk?related_media_id=DqGECHhT')
                .respond(200, recommendationsFeedFixture);
        });

        it('should resolve with a feed', function () {

            api.getRecommendationsFeed('wZuMVmMk', 'DqGECHhT').then(function (feed) {
                expect(feed).toBeDefined();
                expect(feed.feedid).toEqual('wZuMVmMk');
            });

            $httpBackend.flush();
        });

        it('should reject when given empty recommendationsPlaylist', function () {

            api.getRecommendationsFeed('', 'DqGECHhT').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('recommendationsPlaylist is missing');
            });

            $timeout.flush();
        });

        it('should reject when given empty mediaId', function () {

            api.getRecommendationsFeed('wZuMVmMk', '').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual('media id is not given or not a string');
            });

            $timeout.flush();
        });

        it('should fix all item urls', function () {

            api.getRecommendationsFeed('wZuMVmMk', 'DqGECHhT').then(function (feed) {
                expect(feed.playlist[0].image).toMatch(/^http/);
                expect(feed.playlist[0].sources[0].file).toMatch(/^http/);
                expect(feed.playlist[0].tracks[0].file).toMatch(/^http/);
            });

            $httpBackend.flush();
        });

        it('should reject when API returns 404 response', function () {

            request.respond(404, '');

            api.getRecommendationsFeed('wZuMVmMk', 'DqGECHhT').then(notToBeCalled, function (error) {
                expect(error).toBeDefined();
                expect(error.message)
                    .toEqual('Feed with url `https://content.jwplatform.com/v2/playlists/wZuMVmMk?related_media_id=DqGECHhT` does not exist');
            });

            $httpBackend.flush();
        });
    });
});