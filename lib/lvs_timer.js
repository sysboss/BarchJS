// lvm scan timer

// modules
var sys    = require('sys'),
    md5    = require('md5'),
    shell  = require('shelljs/global'),
    spawn  = require('child_process').spawn,
    logger = module.parent.exports.logger,
    config = module.parent.exports.config;

// variables
var volumes = [];

function lvs() {
    var child  = spawn('lvs'),
        stdout = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        stdout += data;
    });

    child.on('close', function(code) {
        if (code == 0) {
            lvs_parse(stdout);
        } else {
            logger.init();
            logger.warn("lvs command failed (code: "+code+")");
            logger.close();
        }
    });
}

function lvs_parse(stdout) {
    var lvs   = stdout.split("\n");
    var regEx = new RegExp(/^\s+(\w+|[aA-zZ0-9\-\_\.\+]*)\s+(\w+)\s+[^ ]+\s+([0-9\.]+)(\w)\s+((\w+|[aA-zZ0-9\-\_\.\+]*)\s+([0-9\.]+))?/);
    var count = 0;

    // remove header and newline
    lvs.splice(0, 1);
    lvs.splice(lvs.length-1, 1);

    // clear array
    volumes.splice(0, volumes.length);

    for (; count < lvs.length; count++) {
        var vol = lvs[count].match(regEx);
        var obj = {
            'uid'     : md5(vol[1]+'.'+vol[2]), 
            'lvname'  : vol[1],
            'vgname'  : vol[2],
            'size'    : vol[3],
            'unit'    : vol[4],
            'snapsize': vol[5],
            'origin'  : vol[6],
            'blkdev'  : '/dev/'+vol[2]+'/'+vol[1]
        };

        volumes.push(obj);
    }
}

// run once
lvs();

// scan timer
var lvsTimer = setInterval( function () {
    lvs();
}, config.get('advanced.lvsTimer'));

module.exports = volumes;
