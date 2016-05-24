// lvm scan timer

// modules
var sys    = require('sys'),
    md5    = require('md5'),
    shell  = require('shelljs/global'),
    spawn  = require('child_process').spawn,
    logger = module.parent.exports.logger,
    config = module.parent.exports.config;
    vgs    = module.parent.exports.vgs;

// variables
var lvsObject = {
    "volumes": [],
    "snapshots": [],
    "parse": function (stdout) {
        var lvs   = stdout.split("\n");
        var regEx = new RegExp(/^\s+(\w+|[aA-zZ0-9\-\_\.\+]*)\s+(\w+|[a-zA-Z0-9\-\_\.\+]*)\s+([aA-zZ\-]{6})\s+([0-9\.]+)(\w+)\s+((\w+|[aA-zZ0-9\-\_\.\+]*)\s+([0-9\.]+))?/);
        var count = 0;

        // remove header and newline
        lvs.splice(0, 1);
        lvs.splice(lvs.length-1, 1);

        // clear arrays
        this.volumes.splice(0, this.volumes.length);
        this.snapshots.splice(0, this.snapshots.length);

        for (; count < lvs.length; count++) {
            var vol = lvs[count].match(regEx);
            var obj = {
                'uid'     : md5(vol[1]+'.'+vol[2]), 
                'lvname'  : vol[1],
                'vgname'  : vol[2],
                'attr'    : vol[3],
                'size'    : vol[4],
                'unit'    : vol[5],
                'snapfull': vol[8],
                'origin'  : vol[7],
                'blkdev'  : '/dev/'+vol[2]+'/'+vol[1]
            };

            // handle snapshots
            if (obj.snapfull) {
                var threshold = vgs.vgThreshold(obj.vgname);

                // monitor usage
                if (obj.snapfull > threshold.maxFull) {
                    logger.log('Snapshot is running out of space (' +obj.snapfull+
                               '%). Aborting backup');

                    //TODO: abort backup and remove snapshot
                } else {
                    this.snapshots.push(obj);
                }
            }
            // handle volumes
            else {
                this.volumes.push(obj);
            }
        }
    },
    "lvsTimer": function () {
        return lvsTimer = setInterval( function () {
            this.lvs();
        }, config.get('advanced.lvsTimer'));
    },
    "lvs": function () {
        var child  = spawn('lvs'),
            stdout = '';

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            stdout += data;
        });

        child.on('close', function(code) {
            if (code == 0) {
                lvsObject.parse(stdout);
            } else {
                logger.warn("lvs command failed (code: "+code+")");
            }
        });
    }
};

// run once and start timer
lvsObject.lvs();
lvsObject.lvsTimer();

module.exports = lvsObject;

