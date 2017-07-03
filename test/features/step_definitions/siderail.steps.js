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

const
    {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {

    //
    // Given steps
    //

    //
    // When steps
    //

    When('I click the {ordinal} item in the siderail', function (num) {
        return $$('.jw-side-rail .jw-side-rail-item').get(num - 1).click();
    });

    //
    // Then steps
    //

    Then('the siderail should be visible', function () {
        return expect($$('.jw-side-rail').count()).to.eventually.equal(1);
    });

    Then('the siderail should not be visible', function () {
        return expect($$('.jw-side-rail').count()).to.eventually.equal(0);
    });

    Then('the siderail title should be {stringInDoubleQuotes}', function (title) {
        return expect($('.jw-side-rail .jw-side-rail-header').getText()).to.eventually.equal(title);
    });

    Then('the siderail should contain {int} items', function (num) {
        return expect($$('.jw-side-rail .jw-side-rail-item').count()).to.eventually.equal(num);
    });

    Then('the {ordinal} item in the siderail should be hidden', function (num) {
        return expect($$('.jw-side-rail .jw-side-rail-item').get(num - 1).isDisplayed())
            .to.eventually.equal(false);
    });

    Then('the image src of the {ordinal} item in the siderail should contain {stringInDoubleQuotes}', function (num, src) {
        return expect($$('.jw-side-rail .jw-side-rail-item-image').get(num - 1).getAttribute('src'))
            .to.eventually.contain(src);
    });

    Then('the title of the {ordinal} item in the siderail should be {stringInDoubleQuotes}', function (num, title) {
        function trim(text) {
            return text.replace(/\s/g, '');
        }

        title = trim(title);

        return expect($$('.jw-side-rail .jw-side-rail-item-title').get(num - 1).getText().then(trim))
            .to.eventually.equal(title);
    });

    Then('the next up slider should be hidden', function () {
        return expect($$('jw-card-slider[feed="vm.activeFeed"]').count())
            .to.eventually.equal(0);
    });

    Then('the next up slider should be visible', function () {
        return expect($('jw-card-slider[feed="vm.activeFeed"]').isDisplayed())
            .to.eventually.equal(true);
    });

});
