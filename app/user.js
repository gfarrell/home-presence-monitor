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

_.extend(User.prototype, {
    pull: function(cb) {
        DB.pullObject('user', this.id, function(data) {
            if(data === null) {
                // no such user
            } else {
                _.merge(this, data);
            }

            if(_.isFunction(cb)) cb.call(this, this);
        }.bind(this));

        return this;
    },

    push: function(cb) {
        DB.pushObject('user', this, function() {
            if(_.isFunction(cb)) cb.call(this, this);
        }.bind(this));

        return this;
    },

    updateLastSeen: function(lastSeen, cb) {
        this.last_seen = lastSeen;
        this.push(cb);

        return this;
    }
});

module.exports = User;
