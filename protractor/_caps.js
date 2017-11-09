/* jshint -W106 */

module.exports = {
    //
    // OS X
    //

    // latest Firefox
    'osx_sierra_firefox': [
        {
            platform:    'MAC',
            browserName: 'firefox',
            os:          'OS X',
            os_version:  'Sierra'
        },
        ['@desktop']
    ],

    // latest Chrome
    'osx_sierra_chrome': [
        {
            platform:    'MAC',
            browserName: 'chrome',
            os:          'OS X',
            os_version:  'Sierra'
        },
        ['@desktop']
    ],

    // latest Safari
    'osx_highsierra_safari': [
        {
            platform:    'MAC',
            browserName: 'safari',
            os:          'OS X',
            os_version:  'High Sierra',
        },
        ['@desktop']
    ],

    //
    // Mobile emulation in Chrome
    //

    // iPhone 6
    'osx_sierra_chrome_iphone_6': [
        {
            platform:        'MAC',
            browserName:     'chrome',
            os:              'OS X',
            os_version:      'Sierra',
            device:          'iPhone 6',
            chromeOptions: {
                mobileEmulation: {
                    deviceName: 'iPhone 6'
                }
            }
        },
        ['@mobile']
    ],

    //
    // Windows
    //

    // Internet Explorer 11
    'win_10_ie_11': [
        {
            platform:    'WINDOWS',
            browserName: 'internet explorer',
            version:     '11',
            os:          'WINDOWS',
            os_version:  '10'
        },
        ['@desktop']
    ],

    // latest Chrome
    'win_10_chrome': [
        {
            platform:    'WINDOWS',
            browserName: 'chrome',
            os:          'WINDOWS',
            os_version:  '10'
        },
        ['@desktop']
    ],

    // latest Firefox
    'win_10_firefox': [
        {
            platform:    'WINDOWS',
            browserName: 'firefox',
            os:          'WINDOWS',
            os_version:  '10'
        },
        ['@desktop']
    ],

    // latest Edge
    'win_10_edge': [
        {
            platform:    'WINDOWS',
            browserName: 'edge',
            os:          'WINDOWS',
            os_version:  '10'
        },
        ['@desktop']
    ]

};
