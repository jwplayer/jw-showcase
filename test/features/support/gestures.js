/**
 * Copyright 2015 Longtail Ad Solutions Inc.
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

defineSupportCode(function () {

    global.swipe = function (element, direction) {

        return browser.executeScript(function (element, direction) {
            var fromX = 200,
                fromY = 100,
                toX   = 200,
                toY   = 100;

            switch (direction) {
            case 'left':
                toX -= 100;
                break;
            case 'right':
                toX += 100;
                break;
            case 'up':
                toY -= 100;
                break;
            case 'down':
                toY += 100;
                break;
            }

            sendTouchEvent(fromX, fromY, element, 'touchstart');
            sendTouchEvent(toX, toY, element, 'touchmove');
            sendTouchEvent(toX, toY, element, 'touchend');

            function sendTouchEvent(x, y, element, eventType) {
                const touchObj = new Touch({
                    identifier: Date.now(),
                    target: element,
                    clientX: x,
                    clientY: y,
                    radiusX: 2.5,
                    radiusY: 2.5,
                    rotationAngle: 10,
                    force: 0.5,
                });

                const touchEvent = new TouchEvent(eventType, {
                    cancelable: true,
                    bubbles: true,
                    touches: [touchObj],
                    targetTouches: [],
                    changedTouches: [touchObj]
                });

                element.dispatchEvent(touchEvent);
            }
        }, element, direction);
    };
});
