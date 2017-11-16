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

    //
    // Then steps
    //

    Then('the footer should contain {int} links', function (num) {
        return expect($$('.jw-footer-link').count()).to.eventually.equal(num);
    });

    Then('the {string} for the {ordinal} link should be {string}', function (type, num, content) {
        var elem = $$('.jw-footer-link').get(num - 1);

        var func;
        switch (type) {
        case 'text':
            func = elem.getText();
            break;
        case 'url':
            func = elem.getAttribute('href');
            break;
        }

        return expect(func).to.eventually.equal(content);
    });

    Then('the footer should contain the copyright text', function() {
        return expect($('.jw-footer p:last-child').getText()).to.eventually.equal('© 2017 Longtail Ad Solutions, Inc. All Rights Reserved. JW Player is a registered trademark.');
    });

});
