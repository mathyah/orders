const fs = require('fs');
const util = require('./util.js');
const daoUser = require('../models/user.js');

function auth(req, res, next) {
    if (req.url.indexOf('/api/public/') !== -1) return next();

    getSessionById(req.cookies.saferecisa, function(session) {
        req.session = session;
        return authenticate({
            _id: session.USER_ID
        }, req.headers['x-access-token'], req.cookies.iv, res, next);
    });
}

async function getSessionById(session_id, callback) {
    let session = await daoUser.getSession(session_id);
    return callback(session[0] || {});
}

async function authenticate(session, token, iv, res, next) {
    if (token) {
        var publicKEY = fs.readFileSync(__dirname + '/../cert/jwtRS256.key.pub', 'utf8');
        iv = new Buffer.from(iv, 'hex');
        let data = await util.verifyJWT(token, iv, publicKEY);
        if (data && session._id == data.user_id) return next();
        else return res.status(403).send({
            success: false,
            message: 'access denied'
        });
        if (session._id) return next();
    } else {
        return res.status(403).send({
            success: false,
            message: 'access denied'
        });
    }
}

module.exports = auth;