/* globals self,caches,importScripts,RangedResponse,toolbox */

const OFFLINE_VIDEO_REGEX = /cdn\.jwplayer\.com\/videos\/(.)+\.mp4$/;

importScripts('sw-toolbox.js');
importScripts('ranged-request.js');

toolbox.options.debug      = true;
toolbox.options.cache.name = 'jw-showcase-v1';

toolbox.precache([
    '/',
    '/config.json',
    '/manifest.json',
    '/favicon.ico',
    '/styles/main.css',
    '/fonts/icons.eot',
    '/fonts/icons.svg',
    '/fonts/icons.ttf',
    '/fonts/icons.woff',
    /* inject:scripts */
]);

toolbox.router.get('/(.*)', toolbox.networkFirst, {origin: 'content.jwplatform.com'});
toolbox.router.get('/(.*)', toolbox.networkFirst, {origin: 'assets-jpcust.jwpsrv.com'});
toolbox.router.get('/(.*)', toolbox.networkFirst, {origin: 'ssl.p.jwpcdn.com'});
toolbox.router.get('/(.*)', toolbox.networkOnly, {origin: 'jwpltx.com'});

toolbox.router.get('/(.*)', function (request) {
    if (RangedResponse.isRangedRequest(request) && OFFLINE_VIDEO_REGEX.test(request.url)) {
        return RangedResponse.create(request);
    }
    return toolbox.networkFirst(request);
}, {origin: 'cdn.jwplayer.com'});

toolbox.router.get('/(.*)', toolbox.cacheFirst);
toolbox.router.default = toolbox.networkFirst;

self.onmessage = function (e) {

    var data = JSON.parse(e.data);

    // needs to be online!
    if (navigator.onLine) {
        if (data.type === 'prefetchPlayer') {
            prefetchPlayer(data.repo);
        }
        else if (data.type === 'prefetchConfig') {
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

/**
 * @todo this should happen sooner, find a way to obtain repo
 * @param repo
 */
function prefetchPlayer (repo) {

    toolbox.cache(repo + 'provider.html5.js');
    toolbox.cache(repo + 'provider.cast.js');
    toolbox.cache(repo + 'jwplayer.controls.js');
    toolbox.cache(repo + 'jwpsrv.js');
    toolbox.cache(repo + 'related.js');
    toolbox.cache(repo + 'jw-icons.woff');
    toolbox.cache(repo + 'jw-icons.ttf');
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