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

module.exports = function () {

    root.swipe = function (element, direction) {

        return browser
            .executeScript(function (element, direction) {

                var fromX = 200,
                    fromY = 200,
                    toX   = 200,
                    toY   = 200;

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

                touchEvent(element, 'touchstart', fromX, fromY);
                touchEvent(element, 'touchmove', toX, toY);
                touchEvent(element, 'touchend', toX, toY);

                function touchEvent (target, name, x, y) {
                    var event = new Event(name);

                    event.touches = [{
                        clientX: x,
                        clientY: y
                    }];

                    event.target = target;
                    target.dispatchEvent(event);
                }

            }, element, direction);
    };

};