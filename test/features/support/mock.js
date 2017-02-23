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

module.exports = function () {

    this.Before(function () {

        browser.addMockModule('ngMockModule', function () {

            angular.module('ngMockModule', ['ngMockE2E'])
                .run(function ($httpBackend) {

                    var mockFeeds = ['lrYLc95e', 'WXu7kuaW', 'Q352cyuc', 'oR7ahO0J'];

                    // mock each feed request defined in mockFeeds
                    angular.forEach(mockFeeds, function (id) {

                        $httpBackend.whenGET('https://content.jwplatform.com/v2/playlists/' + id)
                            .respond(function () {
                                var request = new XMLHttpRequest();

                                request.open('GET', './fixtures/feed/' + id + '.json', false);
                                request.send(null);

                                return [request.status, request.response, {}];
                            });
                    });

                    // let all other requests pass
                    $httpBackend.whenGET(/\S+/)
                        .passThrough();
                });
        });
    });
};
