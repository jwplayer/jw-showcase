'use strict';

const functions      = require('firebase-functions');
const serviceAccount = require('./service-account.json');
const config         = require('./config.json');
const jsonwebtoken   = require('jsonwebtoken');
const admin          = require('firebase-admin');
let domainRegex      = false;

if (config.restricted_domains) {
    let restricted = config.restricted_domains;

    if (!Array.isArray(restricted)) {
        restricted = [restricted];
    }

    // Restructure array of domains to regex with: (domain\.com$|other_domain\.com$)
    domainRegex = new RegExp(`(${restricted.map(domain => domain.replace('.', '\\.')+'$').join('|')})`);
}

// ## Firebase Setup
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
});

const cors = require('cors')({origin: true});

// ## Helpers
const checkDomain = email => false === domainRegex || domainRegex.test(email);

const signItem = item => {
    let id;
    let query = {};

    if (typeof item === 'string') {
        id = item;
    } else {
        id    = item.id;
        query = item.query || query;
    }

    return `/v2/playlists/${id}?token=` + jsonwebtoken.sign(Object.assign(query, {
            resource: `/v2/playlists/${id}`,
            exp     : Math.round(Date.now() / 1000) + (config.signing_ttl_hours * 3600)
        }), config.jw_secret, {noTimestamp: true});
};

const validate = token => {
    if (!config.signing_requires_auth) {
        return Promise.resolve(true);
    }

    return admin.auth().verifyIdToken(token)
        .then(decoded => decoded && checkDomain(decoded.email))
        .catch(() => false);
};

// ## Actual functions
exports.checkEmail = functions.auth.user().onCreate(event => {
    const user = event.data;

    if (!checkDomain(user.email)) {
        admin.auth().deleteUser(user.uid);
    }
});

/**
 * post: {"usertoken": "usertoken here", "playlist": ["foo", "bar"]}
 * @type {HttpsFunction}
 */
exports.token = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.sendStatus(403);
        }

        let {userToken, playlist} = req.body;

        if (config.signing_requires_auth) {
            if (!userToken) {
                return res.sendStatus(400);
            }
        }

        if (!playlist) {
            return res.sendStatus(400);
        }

        validate(userToken).then(allowed => {
            if (!allowed) {
                return res.sendStatus(401);
            }

            return res.status(200).json({playlist: playlist.map(item => signItem(item))});
        }).catch(() => res.sendStatus(500));
    });
});
