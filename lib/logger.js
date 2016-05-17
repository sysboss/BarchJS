// Logger helper

var Syslog  = require('node-syslog');
var program = require('./usage.js');
var logger  = {};

logger.init = function() {
    Syslog.init("node-syslog", Syslog.LOG_PID | Syslog.LOG_ODELAY, Syslog.LOG_DAEMON);
};

logger.close = function() {
    Syslog.close();
};

logger.log = function logger(msg, severity, ident) {
    var level    = typeof severity !== 'undefined' ? 'LOG_'+severity  : 'LOG_INFO',
        ident    = typeof ident    !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';
        severity = typeof severity !== 'undefined' ? severity : 'INFO';

    if (severity == "DEBUG" && !program.debug) {
        return;
    }

    if (program.verbose || program.debug) {
        console.log('['+severity+'] ' + ident + ' ' + msg);
    }

    Syslog.log(Syslog.level, '['+severity+'] ' + ident + ' ' + msg);
};

logger.info = function logger(msg, ident) {
    var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

    if (program.verbose || program.debug) {
        console.log('[INFO] ' + ident + ' ' + msg);
    }

    Syslog.log(Syslog.LOG_INFO, '[INFO] ' + ident + ' ' + msg);
};

logger.warn = function logger(msg, ident) {
    var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

    if (program.verbose || program.debug) {
        console.log('[WARN] ' + ident + ' ' + msg);
    }

    Syslog.log(Syslog.LOG_INFO, '[WARN] ' + ident + ' ' + msg);
};

logger.err = function logger(msg, ident) {
    var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

    if (program.verbose || program.debug) {
        console.log('[ERROR] ' + ident + ' ' + msg);
    }

    Syslog.log(Syslog.LOG_ERR, '[ERROR] ' + ident + ' ' + msg);
};

logger.debug = function logger(msg, ident) {
    var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

    if (!program.debug) {
        return;
    }

    if (program.verbose || program.debug) {
        console.log('[DEBUG] ' + ident + ' ' + msg);
    }

    Syslog.log(Syslog.LOG_DEBUG, '[DEBUG] ' + ident + ' ' + msg);
};

module.exports = logger;
