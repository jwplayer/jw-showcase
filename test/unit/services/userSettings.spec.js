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

describe('Service: userSettings', function () {

    var userSettings;

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_userSettings_) {
        userSettings = _userSettings_;

        // clear all
        window.localStorage.clear();
        window.localStorageSupport = true;
    }));

    describe('when using `set`', function () {

        it('should set a value', function () {
            userSettings.set('conserveBandwidth', true);
            expect(userSettings.settings.conserveBandwidth).toEqual(true);
        });

        it('should not set a value for a not existing key', function () {
            userSettings.set('notexisting', true);
            expect(userSettings.settings.notexisting).toBeUndefined();
        });
    });

    describe('when using `restore`', function () {

        it('should restore all settings', function () {
            window.localStorage.setItem('jwshowcase.usersettings', JSON.stringify({
                cookies: true
            }));
            userSettings.restore();
            expect(userSettings.settings.cookies).toEqual(true);
        });
    });
});