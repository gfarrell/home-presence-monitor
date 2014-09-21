var fs = require('fs');
var _  = require('lodash');
var moment = require('moment');

var _FILE = 'arp.log';

module.exports = {
    read: function(cb) {
        var f = fs.readFile(_FILE, function(err, data) {
            if(err) throw new Error(err);
            this.getTimestamp(function(ts) {
                cb.call(this, {machines: this.parse(data.toString()), age: moment().diff(ts)});
            }.bind(this));
        }.bind(this));
    },

    getTimestamp: function(cb) {
        fs.stat(_FILE, function(err, stats) {
            cb.call(this, moment(stats.mtime));
        });
    },

    parse: function(data) {
        var pattern = /\s(([a-zA-Z0-9]{1,2}\:){5}[a-zA-Z0-9]{1,2})\s/g;
        var matches = data.match(pattern);
        var out = [];
        matches.forEach(function(match) {
            out.push(match.trim());
        });

        return out;
    }
};
