var colors = require('colors');

class Logger {
    debug(message, object) {
        if (!object) object = "";
        // if (environment != "develop") return;
        console.log(dateFormat(new Date()) + " DEBUG: ".blue + message, object);
    }
    warning(message, object) {
        if (!object) object = "";
        console.log(dateFormat(new Date()) + " WARNING: ".yellow + message, object);
        loggerListener('warning', message, object);
    }
    error(message, object) {
        if (!object) object = "";
        console.log(dateFormat(new Date()) + " ERROR: ".red + message, object);
        loggerListener('error', message, object);
    }
    info(message, object) {
        if (!object) object = "";
        console.log(dateFormat(new Date()) + " INFO: ".green + message, object);
    }
};

function dateFormat(date) {
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + " " +
        ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
}

function loggerListener(type, log, object) {
    try {
        mongodb.getCollectionInstance('logs')({
            site: "api",
            type: type,
            message: log,
            object: object || {}
        }).save(function() {});
    } catch (e) {}
}


global.responseFormat = function(status, message, data) {
    return {
        status: status || 'Not status',
        message: message || 'Not aditional message',
        data: data || {}
    };
};

module.exports = new Logger();
