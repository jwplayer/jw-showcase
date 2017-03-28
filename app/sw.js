/* globals self,caches,importScripts,RangedResponse,toolbox */

importScripts('./sw-toolbox.js');
importScripts('./ranged-request.js');

toolbox.options.cache.name = 'jw-showcase-v1';

toolbox.precache([
    '',
    'index.html',
    'config.json',
    'styles/main.css',
    'fonts/icons.eot',
    'fonts/icons.svg',
    'fonts/icons.ttf',
    'fonts/icons.woff',
    'scripts/scripts.js',
    'scripts/vendor.js',
    /* inject:compiled */
]);

toolbox.router.get('content.jwplatform.com', toolbox.networkFirst);
toolbox.router.get('assets-jpcust.jwpsrv.com', toolbox.networkFirst);

toolbox.router.default = function (request) {

    if (RangedResponse.isRangedRequest(request)) {
        return RangedResponse.create(request);
    }

    console.log(request.url);

    return toolbox.cacheFirst(request);
};

self.onmessage = function (e) {

    var data = JSON.parse(e.data);

    console.log(data);

    if (navigator.onLine && data.type === 'prefetchPlayer') {
        prefetchPlayer(data.version);
    }
};

/**
 * @todo this should happen sooner, find a way to obtain latest player version?
 * @param version
 */
function prefetchPlayer (version) {

    var base = 'http://ssl.p.jwpcdn.com/player/v/' + version;

    prefetchUrl(base + '/provider.html5.js');
    prefetchUrl(base + '/jwpsrv.js');
    prefetchUrl(base + '/related.js');
    prefetchUrl(base + '/jw-icons.woff');
    prefetchUrl(base + '/jw-icons.ttf');
}

function prefetchUrl (url) {

    return caches.open(toolbox.options.cache.name).then(function (cache) {
        return fetch(url).then(function (response) {
            return cache.put(url, response.clone()).then(function () {
                return response;
            });
        });
    });
}