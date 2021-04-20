var userDao = require('../models/user');
var fwrDao = require('../models/fwr');

class User {
    constructor() {}

    async get_users(req, res) {
        let users = (await fwrDao.selectFunction("ADMI", "USER", true)) || [];
        return res.status(200).json({
            success: true,
            data: users
        });
    }

    async get_user_info(req, res) {
        let user = (await userDao.getUserById(req.session.USER_ID))[0] || {};
        return res.status(200).json({
            success: true,
            data: user
        });
    }

    async get_sessions(req, res) {
        let sessions = (await fwrDao.selectFunction("ADMI", "SESS", true)) || [];
        return res.status(200).json({
            success: true,
            data: sessions
        });
    }
}

module.exports = new User();