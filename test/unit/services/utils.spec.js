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

describe('Service: utils', function () {

    var utils;

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_utils_) {
        utils = _utils_;
    }));

    describe('when using `ucfirst`', function () {

        it('should uppercase the first character of the given string', function () {
            expect(utils.ucfirst('test')).toEqual('Test');
            expect(utils.ucfirst('Test')).toEqual('Test');
            expect(utils.ucfirst('_test')).toEqual('_test');
        });
    });

    describe('when using `getVideoDurationByItem`', function () {

        it('should format time in seconds when duration is less than 60', function () {
            expect(utils.getVideoDurationByItem({duration: 25})).toEqual('25 sec');
        });

        it('should format time in minutes when duration is 60', function () {
            expect(utils.getVideoDurationByItem({duration: 60})).toEqual('1 min');
        });

        it('should format time in minutes when duration is 80', function () {
            expect(utils.getVideoDurationByItem({duration: 80})).toEqual('2 min');
        });

        it('should return LIVE when duration is 0', function () {
            expect(utils.getVideoDurationByItem({duration: 0})).toEqual('LIVE');
        });
    });

    describe('when using `replaceImageSize`', function () {

        var url = 'https://content.jwplatform.com/thumbs/RltV8MtT-720.jpg';

        it('should replace size in url', function () {
            expect(utils.replaceImageSize(url, 1080)).toEqual('https://content.jwplatform.com/thumbs/RltV8MtT-1080.jpg');
        });
    });

    describe('when using `slugify`', function () {

        it('should replace whitespaces for hyphens', function () {
            expect(utils.slugify('title with one  or multiple whitespaces')).toEqual('title-with-one-or-multiple-whitespaces');
        });

        it('should make characters lowercase', function () {
            expect(utils.slugify('Title With UPPERCASE characters')).toEqual('title-with-uppercase-characters');
        });

        it('should strip special characters', function () {
            expect(utils.slugify('Title With @^- special characters')).toEqual('title-with-special-characters');
        });
    });
});