// lvm scan timer

// modules
var sys    = require('sys'),
    md5    = require('md5'),
    shell  = require('shelljs/global'),
    spawn  = require('child_process').spawn,
    logger = module.parent.exports.logger,
    config = module.parent.exports.config,
    sizeUt = module.parent.exports.sizeUtils;

// variables
var volGroups = [];

function vgs() {
    var child  = spawn('vgs'),
        stdout = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        stdout += data;
    });

    child.on('close', function(code) {
        if (code == 0) {
            vgs_parse(stdout);
        } else {
            logger.init();
            logger.warn("vgs command failed (code: "+code+")");
            logger.close();
        }
    });
}

function verifySize(vgObj) {
    var snapsize;

    try {
        snapsize = config.get('backup.snapshots.'+vgObj.vgname+'.size');
    } catch (e) {
        snapsize = config.get('backup.snapshots.defaults.size');
    }

    // verify free space
    var vgFree  = sizeUt.toMB(vgObj.free+''+vgObj.unit),
        reqFree = sizeUt.toMB(snapsize) * config.get('global.maxForks');

    if (vgFree < reqFree) {
        logger.init();
        logger.err('No free space left on volume group: ' + vgObj.vgname + '. '+reqFree+'MB required');
        logger.close();

        //TODO: graceful shutdown
    }
}

function vgs_parse(stdout) {
    var vgs   = stdout.split("\n");
    var regEx = new RegExp(/^\s+(\w+|[aA-zZ0-9\-\_\.\+]*)\s+.+\s+.+\s+.+\s+([a-z\-]{6})\s+[0-9\.]+\w+\s+([0-9\.]+)(\w+)/);
    var count = 0;

    // remove header and newline
    vgs.splice(0, 1);
    vgs.splice(vgs.length-1, 1);

    // clear array
    volGroups.splice(0, volGroups.length);

    for (; count < vgs.length; count++) {
        var vg  = vgs[count].match(regEx);

        if (!vg) {
            console.error('Failed to parse `vgs` command output');
            exit(2);
        }

        var obj = {
            'vgname': vg[1],
            'attr'  : vg[2],
            'free'  : vg[3],
            'unit'  : vg[4]
        };

        verifySize(obj);
        volGroups.push(obj);
    }
}

// run once
vgs();

// scan timer
var vgsTimer = setInterval( function () {
    vgs();
}, config.get('advanced.vgsTimer'));

module.exports = volGroups;
