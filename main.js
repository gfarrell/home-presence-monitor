// Executes network check on one loop
// Also runs small http server to display who's home

var _            = require('lodash');
var ChildProcess = require('child_process');
var http         = require('http');
var Moment       = require('moment');
var ARP          = require('./app/arp');
var User         = require('./app/user');
var DB           = require('./app/db');

var config       = require('./config/app.json');

var broadcastAddress = require('./app/network').getLocalIp().replace(/\d{1,3}$/, '255');

var mainLoop = function() {
    var child = ChildProcess.execFile('./ping.sh', broadcastAddress, null, function(error, stdout, stderr) {
        var machines = ARP.parse(stdout.toString().toUpperCase());

        User.all(function(users) {
            users.forEach(function(user) {
                if(_.contains(machines, user.device)) {
                    user.updateLastSeen(Moment().format('YYYY-MM-DD HH:mm:ss'));
                }
            });
        });

        DB.set('updated', Moment().format());
    });
};

var checkPresent = function(user) {
    return Math.abs(Moment(user.last_seen).diff(Moment())) < config.user_max_age;
};

var serverResponder = function(req, res) {
    res.writeHead(200);
    res.write('Who is home?\n\n');

    User.all(function(users) {
        var present = _.filter(users, checkPresent);

        present.forEach(function(user) {
            res.write('- ' + user.id + ' (' + Moment(user.last_seen).fromNow() + ')\n');
        });

        res.write('\n----------\n');

        DB.get('updated', function(t) {
            res.write('updated: ' + Moment(t).format('dddd, MMMM Do YYYY, H:mm:ss'));
        });
    });

    setTimeout(function() { res.end(); }, 200);
};

// Exec
console.log('Starting Presence Monitor');
mainLoop();
setInterval(mainLoop, config.data_refresh_interval);
console.log('Starting web server on 8080');
http.createServer(serverResponder).listen(8080);
