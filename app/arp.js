var fs = require('fs');
var _  = require('lodash');

module.exports = {
    readFile: function(cb) {
        var f = fs.readFile('arp.log', function(err, data) {
            cb.call(this, this.parse(data.toString()));
        }.bind(this));
    },

    parse: function(data) {
        var pattern = /(([a-zA-Z0-9]{2}\:?){6})/g;
        return data.match(pattern);
    }
};
