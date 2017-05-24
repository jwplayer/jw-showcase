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

var stepsDefinition = function () {

    this.When(/^I scroll to the featured default slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-container'))
            .then(function (element) {
                return scrollToElement(element);
            })
            .then(callback);
    });


    this.When(/^I scroll to the (\d+)(?:st|nd|th|rd) default slider$/, function (slider, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return scrollToElement(sliders[slider - 1]);
            })
            .then(callback);
    });

    this.When(/^I click the (right|left) arrow in the featured slider$/, function (direction, callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-button-flag-' + direction))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I swipe (left|right) in the (\d+)(?:st|nd|th|rd) default slider/, function (direction, slider, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-align'));
            })
            .then(function (element) {
                return swipe(element, direction).then(delay(callback, 1000));
            });
    });

    this.When(/^I click the first item in the featured slider$/, function (callback) {

        // element is not intractable
        if (browser.browserName === 'firefox') {
            clickElement('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-container')
                .then(delay(callback, 1000));
            return;
        }

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card .jw-card-container'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I click the play icon in the visible item in the featured slider$/, function (callback) {

        // element is not intractable
        if (browser.browserName === 'firefox') {
            clickElement('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-play-button')
                .then(delay(callback, 1000));
            return;
        }

        browser
            .executeScript(function () {
                document
                    .querySelector('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card')
                    .classList.add('jw-card-flag-active');
            })
            .then(function () {
                return browser
                    .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
                    .findElement(by.css('.jw-card-play-button'))
                    .click();
            })
            .then(delay(callback, 1000));
    });

    this.When(/^I click the first featured item in the dashboard/, function (callback) {

        browser
            .findElement(by.css('.jw-card-flag-featured:first-child .jw-card-container'))
            .click()
            .then(delay(callback, 1000));
    });

    this.When(/^I move my mouse to the first item in the (\d+)(?:st|nd|th|rd) default slider$/, function (slider, callback) {

        if (/safari|firefox/i.test(browser.browserName)) {
            return callback(null, 'pending');
        }

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-slide.first'));
            })
            .then(function (element) {
                return browser
                    .actions()
                    .mouseMove(element)
                    .perform()
                    .then(delay(callback, 500));
            });
    });

    this.Then(/^the featured slider should be visible/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^there should be featured items visible/, function (callback) {

        browser
            .findElements(by.css('.jw-card-flag-featured'))
            .then(function (elements) {
                expect(elements.length).to.be.greaterThan(0);
                callback();
            });
    });

    this.Then(/^there should be (\d+) default sliders visible/, function (count, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (elements) {
                expect(elements.length).to.equal(parseInt(count));
                callback();
            });
    });

    this.Then(/^the (first|last) item in the featured slider should (not )?be visible/, function (item, not, callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured'))
            .findElement(by.css('.jw-card-slider-slide.' + item))
            .getAttribute('class')
            .then(function (classNames) {

                if (!not) {
                    expect(classNames).to.contain('is-visible');
                    return callback();
                }

                expect(classNames).not.to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the (first|last) item in the (\d+)(?:st|nd|th|rd) default slider should (not )?be visible/, function (item, slider, not, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-slide.' + item)).getAttribute('class');
            })
            .then(function (classNames) {

                if (!not) {
                    expect(classNames).to.contain('is-visible');
                    return callback();
                }

                expect(classNames).not.to.contain('is-visible');
                callback();
            });
    });

    this.Then(/^the (left|right) arrow in the featured slider should be disabled/, function (direction, callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-button-flag-' + direction))
            .getAttribute('class')
            .then(function (classNames) {
                expect(classNames).to.contain('is-disabled');
                callback();
            });
    });

    this.Then(/^the (left|right) arrow in the (\d+)(?:st|nd|th|rd) default slider should be disabled/, function (direction, slider, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-button-flag-' + direction))
                    .getAttribute('class');
            })
            .then(function (classNames) {
                expect(classNames).to.contain('is-disabled');
                callback();
            });
    });

    this.Then(/^the title and description should be visible in the featured slider/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible'))
            .findElement(by.css('.jw-card-info'))
            .isDisplayed()
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^the card titles should be (visible|hidden) in the (\d+)(?:st|nd|th|rd) default slider$/, function (visible, slider, callback) {

        var element;

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                element = sliders[slider - 1];
                return scrollToElement(element);
            })
            .then(function () {
                return element.findElement(by.css('.jw-card-slider-slide.first .jw-card-info')).isDisplayed();
            })
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(visible === 'visible');
                callback();
            });
    });

    this.Then(/^the title of the (\d+)(?:st|nd|th|rd) default slider should be (hidden|visbile)/, function (slider, visible, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-title')).isDisplayed();
            })
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(visible === 'visible');
                callback();
            });
    });

    this.Then(/^the title of the (\d+)(?:st|nd|th|rd) default slider should be "([^"]*)"$/, function (slider, expectedTitle, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1].findElement(by.css('.jw-card-slider-title')).getText();
            })
            .then(function (title) {

                // title can contain an icon and multiple whitespaces
                title = title
                    .replace(/\s{2,}/g, ' ')
                    .trim();

                expect(title).to.equal(expectedTitle);
                callback();
            });
    });

    this.Then(/^I should see the description in the first item of the (\d+)(?:st|nd|th|rd) default slider/, function (slider, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1]
                    .findElement(by.css('.jw-card-slider-slide.first .jw-card-description'))
                    .isDisplayed();
            })
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });
    });

    this.Then(/^I should see the duration in the first item of the (\d+)(?:st|nd|th|rd) default slider/, function (slider, callback) {

        browser
            .findElements(by.css('.jw-card-slider-flag-default'))
            .then(function (sliders) {
                return sliders[slider - 1]
                    .findElement(by.css('.jw-card-slider-slide.first .jw-card-duration'))
                    .isDisplayed();
            })
            .then(function (isDisplayed) {
                expect(isDisplayed).to.equal(true);
                callback();
            });

    });

    this.Then(/^the card title should be hidden in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-title'))
            .isDisplayed()
            .then(function (displayed) {
                expect(displayed).to.equal(false);
                callback();
            });
    });

    this.Then(/^the card description should be hidden in the featured slider$/, function (callback) {

        browser
            .findElement(by.css('.jw-card-slider-flag-featured .jw-card-slider-slide.is-visible .jw-card-description'))
            .isDisplayed()
            .then(function (displayed) {
                expect(displayed).to.equal(false);
                callback();
            });
    });
};

module.exports = stepsDefinition;