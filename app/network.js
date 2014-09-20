var os = require('os');

module.exports = {
    getLocalIp: function() {
        var ifaces=os.networkInterfaces();

        var assignmentFunc = function(details){
            if (details.family=='IPv4') {
                if(details.address == '127.0.0.1') {
                    return;
                } else if(address === void 0) {
                    address = details.address;
                }
            }
        };

        // get first non-loopback interface
        var address;
        for (var dev in ifaces) {
            if(dev == 'lo') continue;
            ifaces[dev].forEach(assignmentFunc);
        }

        return address;
    }
};
