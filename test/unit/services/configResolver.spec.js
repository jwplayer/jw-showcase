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

describe('Service: configResolver', function () {

    var configFixture = getFixture('config/config'),
        $httpBackend,
        $timeout,
        configResolver;

    function notToBeCalled () {
        throw new Error('This function should not have been called');
    }

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_$httpBackend_, _$timeout_, _configResolver_) {

        $httpBackend   = _$httpBackend_;
        $timeout       = _$timeout_;
        configResolver = _configResolver_;

        // set config location
        window.configLocation = 'config.json';

        window.config = null;
    }));

    describe('when using `getConfig`', function () {

        var request;

        beforeEach(function () {
            request = $httpBackend
                .expectGET('config.json')
                .respond(200, configFixture);
        });

        it('should return a promise', function () {
            expect(configResolver.getConfig().then).toBeDefined('getConfig().then should be defined');
        });

        it('should return the same promise when called multiple times', function () {
            expect(configResolver.getConfig()).toBe(configResolver.getConfig(), 'same promise object');
        });

        it('should resolve with the requested config', function () {

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config).toEqual(configFixture);
                }, notToBeCalled);

            $httpBackend.flush();
        });

        it('should reject when request fails', function () {
            request.respond(404, '');

            configResolver
                .getConfig()
                .then(notToBeCalled, function (e) {
                    expect(e.message).toEqual('Failed to load config file');
                });

            $httpBackend.flush();
        });
    });

    describe('when changing `window.configLocation`', function () {

        var request;

        beforeEach(function () {
            request = $httpBackend
                .expectGET('http://mysite/config.json')
                .respond(200, configFixture);
        });

        it('should make a request to http://mysite/config.json', function () {
            window.configLocation = 'http://mysite/config.json';
            configResolver.getConfig();
            expect($httpBackend.flush).not.toThrow();
        });
    });

    describe('when config is missing properties or has wrong properties', function () {

        var request;

        beforeEach(function () {
            request = $httpBackend
                .expectGET('config.json')
                .respond(200, {});
        });

        it('should reject with an error message when required properties are missing', function () {
            configResolver
                .getConfig()
                .then(notToBeCalled, function (error) {
                    expect(error.message).toContain('The config file is missing the following properties:');
                });

            $httpBackend.flush();
        });

        it('should reject with an error message when playlists property is not an array', function () {
            request.respond(200, {playlists: '', siteName: '', player: '', theme: '', description: '', bannerImage: '', footerText: ''});

            configResolver
                .getConfig()
                .then(notToBeCalled, function (error) {
                    expect(error.message).toEqual('The config file playlists property should be an array');
                });

            $httpBackend.flush();
        });

        it('should reject with an error message when featuredFeed property is not an array', function () {
            request.respond(200, {featuredPlaylist: [], siteName: '', player: '', theme: '', description: '', bannerImage: '', footerText: ''});

            configResolver
                .getConfig()
                .then(notToBeCalled, function (error) {
                    expect(error.message).toEqual('The config file featuredPlaylist property should be a string');
                });

            $httpBackend.flush();
        });
    });

    describe('when `window.config` is defined', function () {

        it('should resolve directly', function () {
            window.config = configFixture;

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config).toBe(configFixture);
                }, notToBeCalled);

            $timeout.flush();
        });
    });
});