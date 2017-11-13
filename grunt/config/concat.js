module.exports = {
    options: {
        process: function (src, filepath) {
            // add 'use strict;  to self invoking functions
            if (filepath.indexOf('app/scripts') === 0) {
                src = src.replace('(function () {', '(function () {\n\n    \'use strict\';');
            }
            return src;
        },

        banner: '/**\n' +
                ' * Copyright 2015 Longtail Ad Solutions Inc.\n' +
                ' *\n' +
                ' * JW Showcase v<%= pkg.version %>\n' +
                ' * @preserve\n' +
                ' *\n' +
                ' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
                ' * you may not use this file except in compliance with the License.\n' +
                ' * You may obtain a copy of the License at\n' +
                ' *\n' +
                ' * http://www.apache.org/licenses/LICENSE-2.0\n' +
                ' *\n' +
                ' * Unless required by applicable law or agreed to in writing, software\n' +
                ' * distributed under the License is distributed on an "AS IS" BASIS,\n' +
                ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n' +
                ' * express or implied. See the License for the specific language\n' +
                ' * governing permissions and limitations under the License.\n' +
                ' **/\n'
    }
};
