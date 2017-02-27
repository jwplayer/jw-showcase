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

describe('Service: session', function () {

    var session;

    beforeEach(function () {
        module('jwShowcase.core');
    });

    beforeEach(inject(function (_session_) {
        session = _session_;

        // clear all
        window.localStorage.clear();
        window.localStorageSupport = true;
    }));

    describe('when using `load`', function () {

        it('should load a value for a given key', function () {
            window.localStorage.setItem('value', 'test');
            expect(session.load('value')).toEqual('test');
        });

        it('should load and parse a JSON string for a given key', function () {
            window.localStorage.setItem('json', '{"test": true}');
            expect(session.load('json')).toEqual({test: true});
        });

        it('should return the given default value if the given key does not exists', function () {
            expect(session.load('value', 'default')).toEqual('default');
        });
    });

    describe('when using `save`', function () {

        it('should save a value for a given key', function () {
            session.save('value', 'test');
            expect(window.localStorage.getItem('value')).toEqual('test');
        });

        it('should save and stringify an Object for a given key', function () {
            session.save('json', {test:true});
            expect(window.localStorage.getItem('json')).toEqual('{"test":true}');
        });
    });

    describe('when using `clear`', function () {

        it('should clear a value for a given key', function () {

            window.localStorage.setItem('value', 'test');
            session.clear('value');
            expect(window.localStorage.getItem('value')).toBeNull();
        });
    });
});