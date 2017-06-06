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

describe('utils', function () {

    var utils;

    beforeEach(function () {
        module(
            'ngAnimate',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'jwShowcase.core'
        );
    });

    beforeEach(inject(function (_utils_) {
        utils = _utils_;
    }));

    function createElement (tagName, className) {
        var el       = document.createElement(tagName);
        el.className = className;
        document.body.appendChild(el);

        return el;
    }

    describe('memoize()`', function () {

        it('should return the callback value when called', function () {

            var mem = utils.memoize(function () {
                return 123;
            });

            expect(mem()).toEqual(123);
        });

        it('should return the memorized value when called the second time', function () {

            var called = 0;

            var mem = utils.memoize(function () {
                called++;
                return 123;
            });

            expect(mem()).toEqual(123);
            expect(called).toEqual(1);
            expect(mem()).toEqual(123);
            expect(called).toEqual(1);
        });
    });

    describe('addStylesheetRules()`', function () {

        it('should add css rules to the document', function () {

            var element = createElement('div', 'test');
            utils.addStylesheetRules([['.test', ['display', 'table']]]);

            expect(getComputedStyle(element).display).toEqual('table');
        });

        it('should reuse the existing stylesheet in the document', function () {

            var element1 = createElement('div', 'test1'),
                element2 = createElement('div', 'test2'),
                before = document.getElementsByTagName('style').length,
                after;

            utils.addStylesheetRules([['.test1', ['display', 'table']]]);
            utils.addStylesheetRules([['.test2', ['display', 'inline']]]);

            after = document.getElementsByTagName('style').length;

            expect(after - before).toEqual(1);
            expect(getComputedStyle(element1).display).toEqual('table');
            expect(getComputedStyle(element2).display).toEqual('inline');
        });
    });

});