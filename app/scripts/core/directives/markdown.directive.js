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

(function () {

    var MARKDOWN_LINK_REGEX          = /\[([^\[]+)]\(((https?:\/\/|www\.)?[^)]+)\)/ig,
        MARKDOWN_ITALIC_REGEX        = /(?:\*|_)(\S[\s\S]*?)(?:\*|_)/ig,
        MARKDOWN_STRONG_REGEX        = /(?:\*{2}|_{2})(\S[\s\S]*?)(?:\*{2}|_{2})/ig,
        MARKDOWN_ITALIC_STRONG_REGEX = /(?:\*{3}|_{3})(\S[\s\S]*?)(?:\*{3}|_{3})/ig,
        LINEBREAK_REGEX              = /(?:\r\n|\r|\n)/g;

    angular
        .module('jwShowcase.core')
        .directive('jwMarkdown', jwMarkdown);

    /**
     * @ngdoc directive
     * @name jwShowcase.core.directive:jwMarkdown
     * @module jwShowcase.core
     *
     * @description
     * # jwMarkdown
     * This directive parses markdown string from the ngModel directive. Currently supported:
     *
     *  - ***bold/italic emphasis*** or ___bold italic emphasis___
     *  - **bold emphasis** or __bold emphasis__
     *  - *italic emphasis* or _italic emphasis_
     *  - [links](http://jwplayer.com)
     *  - line breaks
     *
     * @requires ngModel
     *
     * @example
     *
     * ```
     * <jw-markdown ng-model="vm.item.description"></jw-markdown>
     * ```
     */
    jwMarkdown.$inject = [];
    function jwMarkdown () {

        return {
            link:    link,
            require: 'ngModel'
        };

        function link (scope, element, attrs, ctrl) {

            ctrl.$formatters.push(markdownLinkFormatter);
            ctrl.$formatters.push(markdownBoldAndItalicFormatter);
            ctrl.$formatters.push(linebreakFormatter);
            ctrl.$formatters.push(removeHTMLTagsFormatter);

            /**
             * Render the $viewValue as HTML
             */
            ctrl.$render = function () {
                element.html(ctrl.$viewValue);
            };

            /**
             * Replace markdown bold, italic and these combined formats to HTML tags.
             *
             * @param {string} value
             * @returns {string}
             */
            function markdownBoldAndItalicFormatter (value) {

                if (angular.isString(value)) {
                    value = value.replace(MARKDOWN_ITALIC_STRONG_REGEX, function (match, word) {
                        return '<strong><em>' + word + '</em></strong>';
                    });

                    value = value.replace(MARKDOWN_STRONG_REGEX, function (match, word) {
                        return '<strong>' + word + '</strong>';
                    });

                    value = value.replace(MARKDOWN_ITALIC_REGEX, function (match, word) {
                        return '<em>' + word + '</em>';
                    });
                }

                return value;
            }

            /**
             * Replace markdown links to HTML tags.
             * @param {string} value
             * @returns {string}
             */
            function markdownLinkFormatter (value) {

                if (angular.isString(value)) {
                    value = value.replace(MARKDOWN_LINK_REGEX, function (match, word, link) {

                        var target = /^(https?|www\.)/.test(link) ? ' target="_blank"' : '';

                        return '<a href="' + link + '"' + target + '>' + word + '</a>';
                    });
                }

                return value;
            }

            /**
             * Convert linebreaks to br tags.
             * @param {string} value
             * @returns {string}
             */
            function linebreakFormatter (value) {

                if (angular.isString(value)) {
                    value = value.replace(LINEBREAK_REGEX, '<br />');
                }

                return value;
            }

            /**
             * Remove all HTML tags.
             * @param {string} value
             * @returns {string}
             */
            function removeHTMLTagsFormatter (value) {
                return (value || '').replace(/<[^>]+>/gm, '');
            }
        }
    }

}());
