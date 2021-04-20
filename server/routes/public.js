var userDao = require('../models/user');
var util = require('../helpers/util.js');
var edc = require('email-domain-check');
var fwrDao = require('../models/fwr');
const fs = require('fs');
const crypto = require('crypto');

class Public {
    constructor() {}

    async register(req, res) {

        let userToSave = {
            USER_USER: (req.body.user || "").toLowerCase(),
            USER_PASS: req.body.pass,
            PROF_ID: req.body.prof,
            USER_NAME: capitalizeFirstLetter(req.body.name || ""),
            USER_LAST1: capitalizeFirstLetter(req.body.last1 || ""),
            USER_LAST2: capitalizeFirstLetter(req.body.last2 || ""),
            IDEN_TYPE_CODE: req.body.iden_type_code,
            USER_IDEN: req.body.iden,
            USER_MAIL: (req.body.email || "").toLowerCase(),
            USER_PHON_NUMB: req.body.phon_numb,
            USER_CELP_NUMB: req.body.celp_numb,
            USER_PHOT: req.body.phot,
            CREATED: new Date(Date()).toUTCString(),
            CREATED_BY: req.body.created_by
        };

        let good_params = true;
        for (var i in userToSave) {
            if (!userToSave[i]) {
                good_params = false;
                break;
            }
        }
        if (!good_params) return util.sendError(res, "missing_params");
        let good_email = await edc(req.body.email);
        if (!good_email) return util.sendError(res, "wrong_email");
        if (userToSave.USER_PASS.length < 10) return util.sendError(res, "invalid_password_length");
        if (userToSave.USER_PASS.search(/\d/) == -1) return util.sendError(res, "invalid_password_no_num");
        if (userToSave.USER_PASS.search(/[a-zA-Z]/) == -1) return util.sendError(res, "invalid_password_no_letter");

        let response = await createUser(userToSave);

        if (response.error) return util.sendError(res, response.error);

        return res.status(200).json({
            success: true,
            user: response.user[0]
        });
    }

    async login(req, res) {
        var user;
        if (req.body.user)
            user = (await userDao.getUserByUsername((req.body.user).toLowerCase()))[0] || {};
        else
            return util.sendError(res, 'request don\'t have user');
        if (!user.ID) return util.sendError(res, 'username_does_not_exists');

        let check = await util.passwordVerify(req.body.pass, user.USER_PASS);

        if (!check) return util.sendError(res, "password_wrong");

        return LoginUser(user, res);
    }

    logout(req, res) {
        res.clearCookie("saferecisa");
        return res.status(200).json({
            success: true,
            data: 'session_closed'
        });
    }
}

async function createUser(user) {
    const _util = require('../helpers/util.js');

    return new Promise(async(resolve) => {

        let existing_user = (await userDao.getUserByUsernameOrEmail(user.USER_USER, user.USER_MAIL))[0] || {};

        if (existing_user.ID) {
            if (existing_user.username == user.USER_USER) {
                return resolve({
                    error: 'username_in_use'
                });
            } else {
                return resolve({
                    error: 'email_in_use'
                });
            }
        }
        user.USER_PASS = await _util.generatePassword(user.USER_PASS);
        let userArr = Object.values(user);
        let userArrPostgres = JSON.stringify(userArr);
        userArrPostgres = "'{" + userArrPostgres.substring(1, userArrPostgres.length - 1) + "}'";
        fwrDao.insertFunction("ADMI", "USER", userArrPostgres, true)
            .then(function(new_user) {
                delete new_user[0].USER_PASS;
                return resolve({
                    error: null,
                    user: new_user
                });
            })
            .catch(function(err) {
                return resolve({
                    error: err,
                    user: {}
                });
            });
    });
}

async function LoginUser(user, res) {
    let session = (await userDao.getSession(user.ID))[0] || {};

    let data_sess = {
        USER_ID: user.ID,
        TOKE: Math.random().toString(36).substr(2, 10),
        DATE: new Date(Date()).toUTCString(),
        DUE_DATE: new Date(Date.now() + 3600 * 8 * 1000).toUTCString() // Add 8 hours to current date in miliseconds
    };

    if (!session.ID) {
        session = (await userDao.saveSession(Object.values(data_sess)))[0];
    } else {
        data_sess.ID = session.ID;
        session = (await userDao.updateSession(Object.values(data_sess)))[0];
    }

    var data = {};
    data.session_id = session.ID;

    let session_data = {
        user_id: user.ID
    };

    var privateKEY = fs.readFileSync(__dirname + '/../cert/jwtRS256.key', 'utf8');
    let iv = crypto.randomBytes(16);

    let token = await util.generateJWT(session_data, iv, privateKEY, '8h');
    if (!token) return res.status(200).json({
        success: false,
        error: "internal_error"
    });
    let options = {
        maxAge: 3600000 * 14 * 24, //2 weeks
        httpOnly: true
    };
    // Set cookie
    res.cookie('saferecisa', session.TOKE, options);
    res.cookie('language', "en", options);
    res.cookie('iv', iv.toString('hex'), options);
    data.session_cookie = session.TOKE;
    data.auth_token = token;
    data._id = user.ID;
    data.email = user.USER_MAIL;
    data.name = user.USER_NAME;
    data.lastname = user.USER_LAST1;
    data.username = user.USER_USER;
    data.pic = user.USER_PHOT;
    res.status(200).json({
        success: true,
        user: data
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = new Public();