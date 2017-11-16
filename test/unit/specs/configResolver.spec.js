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

describe('configResolver', function () {

    var configs = {
            default:             getFixture('config/default'),
            custom:              getFixture('config/custom'),
            disableFeaturedText: getFixture('config/disableFeaturedText'),
            noFeaturedPlaylist:  getFixture('config/noFeaturedPlaylist'),
            noPlaylists:         getFixture('config/noPlaylists')
        },
        oldConfigs = {
            default:             getFixture('config/v1/default'),
            custom:              getFixture('config/v1/custom'),
            disableFeaturedText: getFixture('config/v1/disableFeaturedText'),
            noFeaturedPlaylist:  getFixture('config/v1/noFeaturedPlaylist'),
            noPlaylists:         getFixture('config/v1/noPlaylists')
        },
        $httpBackend,
        $timeout,
        configResolver;

    function notToBeCalled () {
        throw new Error('This function should not have been called');
    }

    beforeEach(module(
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'jwShowcase.core'
    ));

    beforeEach(inject(function (_$httpBackend_, _$timeout_, _configResolver_) {

        $httpBackend   = _$httpBackend_;
        $timeout       = _$timeout_;
        configResolver = _configResolver_;

        // set config location
        window.configLocation = 'config.json';

        window.config = null;
    }));

    describe('getConfig()', function () {

        var request;

        beforeEach(function () {
            request = $httpBackend
                .expectGET('config.json')
                .respond(200, configs.default);
        });

        it('should return a promise', function () {
            expect(configResolver.getConfig().then).toBeDefined('getConfig().then should be defined');
        });

        it('should return the same promise when called multiple times', function () {
            expect(configResolver.getConfig()).toBe(configResolver.getConfig(), 'same promise object');
        });

        it('should resolve', function () {

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config.version).toEqual('2');
                    expect(config.player).toEqual('ihWAPEHr');
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

        it('should reject when missing required fields', function () {

            request.respond(200, {
                version: '2'
            });

            configResolver
                .getConfig()
                .then(notToBeCalled, function (e) {
                    expect(e.message)
                        .toEqual('The config file is missing the following properties: player, theme, siteName, description');
                });

            $httpBackend.flush();
        });

        it('should reject content is not an array', function () {

            request.respond(200, {
                version:     '2',
                player:      'N8axwZHA',
                theme:       'light',
                siteName:    'JW Showcase',
                description: 'desc',
                content:     false
            });

            configResolver
                .getConfig()
                .then(notToBeCalled, function (e) {
                    expect(e.message).toEqual('The config file content property should be an array');
                });

            $httpBackend.flush();
        });
    });

    describe('getConfig() with a deprecated config', function () {

        var request;

        beforeEach(function () {
            request = $httpBackend
                .expectGET('config.json');
        });

        it('should serialize the default config to v2', function () {

            request.respond(200, oldConfigs.default);

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config.version).toEqual('2');
                    expect(config.content).toBeDefined();
                }, notToBeCalled);

            $httpBackend.flush();
        });

        it('should serialize the disableFeaturedText config to v2', function () {

            request.respond(200, oldConfigs.disableFeaturedText);

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config.content).toBeDefined();
                    expect(config.content[0].enableText).toBe(false);
                }, notToBeCalled);

            $httpBackend.flush();
        });

        it('should serialize the noFeaturedPlaylist config to v2', function () {

            request.respond(200, oldConfigs.noFeaturedPlaylist);

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config.content).toBeDefined();
                    expect(config.content[0].featured).toBe(false);
                }, notToBeCalled);

            $httpBackend.flush();
        });

        it('should serialize the noPlaylists config to v2', function () {

            request.respond(200, oldConfigs.noPlaylists);

            configResolver
                .getConfig()
                .then(function (config) {
                    expect(config.content).toBeDefined();
                    expect(config.content.length).toBe(3);
                }, notToBeCalled);

            $httpBackend.flush();
        });

        it('should reject when playlist is not an array', function () {

            request.respond(200, {
                player:      'N8axwZHA',
                theme:       'light',
                siteName:    'JW Showcase',
                description: 'desc',
                playlists:   false
            });

            configResolver
                .getConfig()
                .then(notToBeCalled, function (e) {
                    expect(e.message).toEqual('The config file playlists property should be an array');
                });

            $httpBackend.flush();
        });

        it('should reject when featuredPlaylist is not a string', function () {

            request.respond(200, {
                player:           'N8axwZHA',
                theme:            'light',
                siteName:         'JW Showcase',
                description:      'desc',
                featuredPlaylist: false
            });

            configResolver
                .getConfig()
                .then(notToBeCalled, function (e) {
                    expect(e.message).toEqual('The config file featuredPlaylist property should be a string');
                });

            $httpBackend.flush();
        });
    });

    describe('getConfig() with window.config defined', function () {

        it('should resolve with the window.config object', function () {

            window.config = configs.default;
            configResolver.getConfig().then(function (config) {
                expect(config).toEqual(configs.default);
            });

            $timeout.flush();
        });
    });

});
