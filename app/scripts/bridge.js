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

(function (global) {

    var listeners  = {},
        jwShowcase = {};

    jwShowcase.on = function (event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].unshift(callback);
    };

    jwShowcase.off = function (event, callback) {
        if (listeners[event]) {
            listeners[event] = listeners[event].filter(function (current) {
                return current !== callback;
            });
        }
    };

    jwShowcase.dispatch = function (event) {
        var args = Array.prototype.slice.call(arguments, 1);

        if (listeners[event]) {
            listeners[event].forEach(function (callback) {
                try {
                    callback.apply(this, args);
                } catch (e) {
                    // error
                }
            });
        }
    };

    global.jwShowcase = jwShowcase;

}(window));
