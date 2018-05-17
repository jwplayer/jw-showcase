/* globals self,caches,RangedResponse,toolbox */

/* inject:vendorscripts */

var OFFLINE_VIDEO_REGEX = /cdn\.jwplayer\.com\/videos\/(.)+\.mp4$/;

toolbox.options.debug      = false;
toolbox.options.cache.name = 'jw-showcase';

toolbox.precache([
    '/',
    '/index.html',
    '/config.json',
    '/manifest.json',

    // Scripts
    'application.js',
    'bridge.js',
    'scripts.js',
    'vendor.1.js',
    'vendor.2.js',

    // Styles
    '../styles/main.css',
    '../styles/vendor.css',

    // Fonts
    '../fonts/icons.ttf'
]);

toolbox.router.get('/(.*)', toolbox.networkFirst, { origin: 'content.jwplatform.com' });
toolbox.router.get('/(.*)', toolbox.networkFirst, { origin: 'assets-jpcust.jwpsrv.com' });
toolbox.router.get('/(.*)', toolbox.networkFirst, { origin: 'ssl.p.jwpcdn.com' });
toolbox.router.get('/(.*)', toolbox.networkOnly, { origin: 'jwpltx.com' });

toolbox.router.get(
    '/(.*)',
    function (request) {
        if (RangedResponse.isRangedRequest(request) && OFFLINE_VIDEO_REGEX.test(request.url)) {
            return RangedResponse.create(request);
        }
        return toolbox.networkFirst(request);
    },
    {
        origin: 'cdn.jwplayer.com'
    }
);

toolbox.router.get('/(.*)', toolbox.cacheFirst);
toolbox.router.default = toolbox.networkFirst;

self.onmessage = function (e) {
    var data = JSON.parse(e.data);

    // needs to be online!
    if (navigator.onLine) {
        if (data.type === 'prefetchPlayer') {
            prefetchPlayer(data.repo);
        } else if (data.type === 'prefetchConfig') {
            prefetchConfig(data.config);
        }
    }
};

self.addEventListener('install', function (event) {
    return event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
    return event.waitUntil(self.clients.claim());
});

function prefetchPlayer (repo) {
    toolbox.cache(repo + 'provider.html5.js');
    toolbox.cache(repo + 'provider.cast.js');
    toolbox.cache(repo + 'jwplayer.controls.js');
    toolbox.cache(repo + 'jwpsrv.js');
    toolbox.cache(repo + 'related.js');
}

function prefetchConfig (config) {
    var base    = config.contentService,
        content = config.content || [];

    content.forEach(function (content) {
        if (content.playlistId !== 'continue-watching' && content.playlistId !== 'saved-videos') {
            toolbox.cache(base + '/v2/playlists/' + content.playlistId);
        }
    });

    if (config.assets.bannerImage) {
        toolbox.cache(config.assets.bannerImage);
    }
}
