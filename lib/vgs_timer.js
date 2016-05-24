// vgs scan timer

// modules
var sys    = require('sys'),
    md5    = require('md5'),
    shell  = require('shelljs/global'),
    spawn  = require('child_process').spawn,
    logger = module.parent.exports.logger,
    config = module.parent.exports.config,
    sizeUt = module.parent.exports.sizeUtils;

// variables
var vgsObject = {
    "groups": [],
    "parse": function (stdout) {
        var vgs   = stdout.split("\n");
        var regEx = new RegExp(/^\s+(\w+|[aA-zZ0-9\-\_\.\+]*)\s+.+\s+.+\s+.+\s+([a-z\-]{6})\s+[0-9\.]+\w+\s+([0-9\.]+)(\w+)/);
        var count = 0;

        // remove header and newline
        vgs.splice(0, 1);
        vgs.splice(vgs.length-1, 1);

        // clear array
        this.groups.splice(0, this.groups.length);

        for (; count < vgs.length; count++) {
            var vg = vgs[count].match(regEx);

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

            this.verifySize(obj);
            this.groups.push(obj);
        }
    },
    "vgThreshold": function (vgname) {
        var snapsize, maxFull;

        // check snapshot size
        try {
            snapsize = config.get('backup.snapshots.'+vgname+'.size');
        } catch (e) {
            snapsize = config.get('backup.snapshots.defaults.size');
        }

        // check snapshot usage threshold
        try {
            maxFull = config.get('backup.snapshots.'+vgname+'.maxFull');
        } catch (e) {
            maxFull = config.get('backup.snapshots.defaults.maxFull');
        }

        return {
            'snapsize': snapsize,
            'maxFull' : maxFull
        };
    },
    "verifySize": function (vgObj) {
        var threshold = this.vgThreshold(vgObj.vgname);

        // verify free space
        var vgFree  = sizeUt.toMB(vgObj.free+''+vgObj.unit),
            reqFree = sizeUt.toMB(threshold.snapsize) * config.get('global.maxForks');

        if (vgFree < reqFree) {
            logger.init();
            logger.err('No free space left on volume group: ' + vgObj.vgname + '. '+reqFree+'MB required');
            logger.close();

            //TODO: graceful shutdown
        }
    },
    "vgsTimer": function () {
        return setInterval( function () {
            this.vgs();
        }, config.get('advanced.vgsTimer'));
    },
    "vgs": function () {
        var child  = spawn('vgs'),
            stdout = '';

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            stdout += data;
        });

        child.on('close', function(code) {
            if (code == 0) {
                vgsObject.parse(stdout);
            } else {
                logger.init();
                logger.warn("vgs command failed (code: "+code+")");
                logger.close();
            }
        });
    }
};

// run once and start timer
vgsObject.vgs();
vgsObject.vgsTimer();

module.exports = vgsObject;
