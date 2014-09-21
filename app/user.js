var _  = require('lodash');
var DB = require('./db');

var User = function() {
    this.id = this.device = this.last_seen = null;
};

User.create = function(username) {
    var u = new User();
    u.id = username;
    return u;
};

User.all = function(cb) {
    DB.pullSet('users', function(set) {
        var users = [];
        var c = 0;

        var incr = function(usr) {
            users.push(usr);
        };

        set.forEach(function(id) {
            User.create(id).pull(incr);
        });

        var timer = setInterval(function() {
            if(c > 1000) {
                clearInterval(timer);
                throw new Error('Unable to fetch all users... timed out.');
            } else {
                if(users.length == set.length) {
                    clearInterval(timer);
                    if(_.isFunction(cb)) {
                        cb(users);
                    }
                } else {
                    c++;
                }
            }
        }, 2);
    });
};

_.extend(User.prototype, {
    pull: function(cb) {
        var self = this;

        DB.pullObject('user', this.id, function(data) {
            if(data === null) {
                // no such user
            } else {
                _.merge(self, data);
            }

            if(_.isFunction(cb)) cb.call(self, self);
        });

        return this;
    },

    push: function(cb) {
        var self = this;

        DB.pushObject('user', this, function() {
            DB.pushSet('users', self.id, function() {
                if(_.isFunction(cb)) cb.call(self, self);
            });
        });

        return this;
    },

    updateLastSeen: function(lastSeen, cb) {
        this.last_seen = lastSeen;
        this.push(cb);

        return this;
    }
});

module.exports = User;
