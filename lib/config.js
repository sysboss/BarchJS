// config parser

var fs      = require('fs'),
    convict = require('convict'),
    check   = require('validator');

var config = convict({
    "global": {
        "maxForks": {
            doc: 'Max parallel backup instances',
            format: 'int',
            default: 1
        },
        "logFacility": {
            doc: 'Syslog facility (default LOG_DAEMON)',
            format: String,
            default: 'LOG_DAEMON'
        },
        "cache_dir": {
            doc: 'Temporary work directory',
            format: function check (dir) {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
            },
            default: '/var/cache/barchjs'
        }
    },
    "backup": {
        "snapshots": {
            "defaults": {
                "size": {
                    doc: "Default snapshot size",
                    format: function check (val) {
                        if (!/^\d+[a-zA-Z]+$/.test(val)) {
                          throw new Error('must contain valid size (example: 10G)')
                        }
                    },
                    default: "1G"
                },
                "maxFull": {
                    doc: "Max. snapshot size usage (in %)",
                    format: 'int',
                    default: 90
                }
            }
        }
    },
    "features": {
        "DRBD": {
            "enabled": {
                doc: "Check if volume is a drbd device (true/false)",
                format: ['true', 'false'],
                default: 'false'
            }
        }
    },
    "advanced": {
        "lvsTimer": {
            doc: "LVM scan interval in milliseconds",
            format: 'int',
            default: 120000
        },
        "vgsTimer": {
            doc: "volume groups scan interval in milliseconds",
            format: 'int',
            default: 900000
        }
    }
});

// load config
try {
    config.loadFile('/var/www/NodeJs/BarchJS/config.json');
} catch (e) {
    console.error('config.json not found');
    exit(2);
}

// validate config
try {
    config.validate();
} catch (e) {
    console.error('Please check you config.json');
    console.error(e);
    exit(1);
}

module.exports = config;
