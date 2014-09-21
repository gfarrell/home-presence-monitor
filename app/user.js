var _      = require('lodash');
var redis  = require('redis');
var client = redis.createClient();

var User = function() {
    this.username = this.device = this.last_seen = null;
};

User.create = function(username) {
    var u = new User();
    u.username = username;
    return u;
};

User.exists = function(username, cb) {
    client.exists('user:' + username, cb);
};

_.extend(User.prototype, {
    pull: function(cb) {
        client.hmget(['user:' + this.username, 'device', 'last_seen'], function(err, repl) {
            if(repl === null) {
                // user does not exist
                // maybe do something?
            } else {
                this.device    = repl[0];
                this.last_seen = repl[1];
            }

            if(_.isFunction(cb)) cb.call(this, this);
        }.bind(this));
    },

    push: function(cb) {
        var data = ['user:' + this.username];

        if(!_.isNull(this.device)) data.push('device', this.device);
        if(!_.isNull(this.last_seen)) data.push('last_seen', this.last_seen);

        client.hmset(data, function(err, repl) {
            if(err) {
                throw new Error('Unable to push user ' + username);
            } else {
                if(_.isFunction(cb)) cb.call(this, this);
            }
        });
    }
});

module.exports = User;
