var request = require('request');

class Utils {
    constructor() {}

    generatePassword(password) {
        return new Promise((resolve) => {
            const bcrypt = require("bcrypt");
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    return resolve(hash);
                });
            });
        });
    }

    sendError(res, error) {
        res.status(200).json({
            success: false,
            message: error
        });
    }

    randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    async sendVerificationCode(name, email, lang, template, code, req) {
        var randomstring = require("randomstring");
        var mail = require('./mail.js');
        if (!code)
            code = randomstring.generate(10);
        return await mail.sendEmailCode(name, email, code, lang, template, req);
    }

    passwordVerify(password, bd_hash) {
        return new Promise((resolve) => {
            const bcrypt = require('bcrypt');
            const passwordHash = require('password-hash');
            bcrypt.compare(password, bd_hash, function(err, php_verify) {
                let node_verify = passwordHash.verify(password, bd_hash);
                return resolve(php_verify || node_verify);
            });
        });
    }
    generateJWT(payload, iv, key, expiresIn) {
        var me = this;
        return new Promise((resolve) => {
            let jwt = require('jsonwebtoken');
            const MAX_AGE = expiresIn || '2w'; //2 weeks;
            let encrypted_payload = {
                payload: me.encrypt(JSON.stringify(payload), iv)
            };

            jwt.sign(encrypted_payload, key, {
                algorithm: "RS256",
                expiresIn: MAX_AGE
            }, function(err, token) {
                if (err) {
                    logger.error("Error generating token", err.message);
                }
                resolve(err ? null : token);
            });
        });
    }
    encrypt(text, iv) {
        var crypto = require('crypto'),
            algorithm = config.general_algorithm,
            password = config.generate_token_used_pss;
        var cipher = crypto.createCipheriv(algorithm, password, iv || '');
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    uploadLogo(route, name, file, callback) {
        var path = require('path');
        var fileName = 'public/' + route + '/' + name + path.extname(file.name);
        file.mv(fileName, function(err) {
            if (err) {
                logger.error('Error saving temporal file for ' + fileName, err);
                return callback('error_upload_support_pic', null);
            } else {
                return callback(null, '/' + route + '/' + name + path.extname(file.name));
            }
        });
    }

    sleep(time) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, time);
        });
    }

    hoursAgo(hours) {
        var inServerNow = new Date();
        inServerNow = inServerNow.setHours(inServerNow.getHours() - hours);
        return inServerNow;
    }

    verifyJWT(token, iv, key) {
        var me = this;
        return new Promise((resolve) => {
            var jwt = require('jsonwebtoken');
            jwt.verify(token, key, {
                algorithms: ["RS256"]
            }, function(err, decoded) {
                if (err) {
                    logger.error("Error verifying token", err.message);
                    return resolve(null);
                }
                let data = me.decrypt(decoded.payload, iv);
                data = JSON.parse(data);
                data.iat = decoded.iat;
                data.exp = decoded.exp;
                resolve(data);
            });
        });
    }
    decrypt(text, iv) {
        var crypto = require('crypto'),
            algorithm = config.general_algorithm,
            password = config.generate_token_used_pss;
        var decipher = crypto.createDecipheriv(algorithm, password, iv);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    dateFormat(date) {
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        date = new Date(date);
        return date.toLocaleDateString('es-ES', options);
    }
    minutesAgo(minutes) {
        var inServerNow = new Date();
        return inServerNow.setTime(inServerNow.getTime() - (minutes * 60000));
    }
}
module.exports = new Utils();