global.config = require('./config.json');
const express = require('express');
const path = require('path');
var compression = require('compression');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var helmet = require('helmet');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socket;
io.on('connection', function(_socket) {
    socket = _socket;
});
/************************ global configuration ************************/
global.logger = require('./helpers/logger.js');
global.postgres = require('./helpers/pg.js');
/************************ configuration express ************************/
app.disable('x-powered-by');
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(fileUpload());
app.use("/", express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '../app/dist/')));
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
/************************ configuration express ************************/
var routes = {};
fs.readdirSync(__dirname + "/routes").forEach(function(file) {
    var moduleName = file.split('.')[0];
    routes[moduleName] = require(__dirname + '/routes/' + moduleName);
});
var schedule = require('node-schedule');
for (var i in routes) {
    var route = routes[i];
    if (route.cronjobs && route.cronjobs.length) {
        route.cronjobs.forEach(function(job) {
            new schedule.scheduleJob(job.pattern, route[job.method]);
        });
    }
}
/************************ Setting routes ************************/
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../app/dist/app/index.html'));
});
/************************ Setting routes ************************/
// app.all('/:route', requestHandler);
app.use(require('./helpers/auth.js'));
app.post('/api/:route/:method', requestHandler);
app.get('/api/:route/:method', requestHandler);
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        data: {
            message: '¿What are you looking for?'
        }
    });
});
/************************ Setting routes ************************/
function requestHandler(req, res) {
    try {
        return routes[req.params.route][req.params.method || req.method.toLowerCase()](req, res, io, socket);
    } catch (e) {
        logger.error("WEI API HAS CRASHED - " + e.message, {
            error: e,
            stack: e.stack
        });
        res.status(500).json({
            success: false,
            data: "Internal error"
        });
    }
}
let port = process.env.PORT || 8080;
/************************ Setting routes ************************/
server.listen(port, function() {
    logger.debug('fwr-angular baackend is listening on port ' + port + '!');
});