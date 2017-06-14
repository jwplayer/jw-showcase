module.exports = {
    options: {
        sassDir:                 '<%= config.app %>/styles',
        cssDir:                  '.tmp/styles',
        generatedImagesDir:      '.tmp/images/generated',
        imagesDir:               '<%= config.app %>/images',
        javascriptsDir:          '<%= config.app %>/scripts',
        fontsDir:                '<%= config.app %>/styles/fonts',
        importPath:              './bower_components',
        httpImagesPath:          '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath:           '/styles/fonts',
        relativeAssets:          false,
        assetCacheBuster:        false,
        raw:                     'Sass::Script::Number.precision = 10\n'
    },
    dist:    {
        options: {
            generatedImagesDir: '<%= config.dist %>/images/generated'
        }
    },
    server:  {
        options: {
            sourcemap: false
        }
    }
};