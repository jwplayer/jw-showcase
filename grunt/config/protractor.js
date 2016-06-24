module.exports = {

    options: {
        configFile: 'test/karma.conf.js',
        singleRun:  true
    },

    dev: {
        options: {
            configFile: 'protractor.conf.js'
        }
    },

    browserstack: {
        options: {
            configFile: 'protractor.browserstack.conf.js'
        }
    }

};