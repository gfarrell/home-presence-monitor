var redis = require('redis');
var _     = require('lodash');

var DB = {
    client: redis.createClient(),

    pushObject: function(type, obj, cb) {
        var objKey = _.has(obj, 'id') ? type + ':' + obj.id : type;
        var data   = [objKey].concat(this.getRedisHashFromObj(obj));

        this.client.hmset(data, function(err, reply) {
            if(err) throw new Error('DB.pushObject: ' + err);

            if(_.isFunction(cb)) {
                cb(reply);
            }
        });

        return this;
    },

    pullObject: function(type, id, cb, onlyKeys) {
        var objKey = id !== void 0 ? type + ':' + id : type;

        if(typeof onlyKeys == 'object') {
            this.client.hmget([objKey].concat(onlyKeys), function(err, reply) {
                if(err) throw new Error('DB.pullObject: ' + err);
                var h = {};
                onlyKeys.forEach(function(k, i) {
                    h[k] = reply[i];
                });

                if(_.isFunction(cb)) {
                    cb(h);
                }
            });
        } else {
            this.client.hgetall([objKey], function(err, reply) {
                if(err) throw new Error('DB.pullObject: ' + err);

                if(_.isFunction(cb)) {
                    cb(reply);
                }
            });
        }

        return this;
    },

    pushSet: function(name, items, cb) {
        if(!_.isArray(items)) items = [items];

        this.client.sadd(name, items, function(err, reply) {
            if(err) throw new Error('DB.pushSet: ' + err);

            if(_.isFunction(cb)) cb(items);
        });

        return this;
    },

    pullSet: function(name, cb) {
        this.client.smembers(name, function(err, reply) {
            if(err) throw new Error('DB.pullSet: ' + err);

            if(_.isFunction(cb)) cb(reply);
        });

        return this;
    },

    getRedisHashFromObj: function(obj) {
        var a = [];

        _.keys(obj).forEach(function(k) {
            var v = obj[k];
            if(!_.isFunction(v)) {
                a.push(k, v);
            }
        });

        return a;
    }
};

module.exports = DB;
