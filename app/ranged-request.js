/* globals Response,caches */

/**
 * RangedResponse class
 */
function RangedResponse () {

}

RangedResponse.isRangedRequest = function (request) {

    var header = request.headers.get('Range');

    if (!header) {
        return false;
    }

    return !!header.trim().toLowerCase();
};

RangedResponse.canHandleRequest = function (request) {

    return Promise.resolve().then(function () {

        if (!RangedResponse.isRangedRequest(request)) {
            return false;
        }

        return caches.match(request.url).then(function (response) {
            return !!response;
        });
    });
};

RangedResponse.create = function (request) {

    return Promise.resolve().then(function () {

        const rangeHeader = request.headers.get('Range').trim().toLowerCase();

        return caches.match(request.url).then(function (response) {

            if (!rangeHeader.startsWith('bytes=')) {
                return new Response('Invalid range unit', {status: 400});
            }

            return response.arrayBuffer().then(function (buffer) {

                const rangeParts = /(\d*)-(\d*)/.exec(rangeHeader);
                const length     = buffer.byteLength;
                var start, end;

                if (rangeParts[1] === '') {
                    start = buffer.byteLength - Number(rangeParts[2]);
                    end   = buffer.byteLength;
                }
                else if (rangeParts[2] === '') {
                    start = Number(rangeParts[1]);
                    end   = buffer.byteLength;
                }
                else {
                    start = Number(rangeParts[1]);
                    end   = Number(rangeParts[2]) + 1; // range values are inclusive
                }

                if (end > length || start < 0) {
                    return new Response('Range Not Satisfiable', {status: 416});
                }

                const slicedBuffer   = buffer.slice(start, end);
                const slicedResponse = new Response(slicedBuffer, {
                    status:  206,
                    headers: response.headers
                });

                slicedResponse.headers.set('Content-Length', slicedBuffer.byteLength);
                slicedResponse.headers.set('Content-Range', ['bytes ', start, '-', end - 1, '/',
                    buffer.byteLength].join(''));

                return slicedResponse;
            });
        });
    });
};