// Logger

var Syslog  = require('node-syslog'),
    program = require('./usage.js');

var logger = {
    "init":  function () {
        Syslog.init("node-syslog", Syslog.LOG_PID | Syslog.LOG_ODELAY, Syslog.LOG_DAEMON);
    },
    "close": function () {
        Syslog.close();
    },
    "log": function(msg, severity, ident) {
        var level    = typeof severity !== 'undefined' ? 'LOG_'+severity  : 'LOG_INFO',
            ident    = typeof ident    !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';
            severity = typeof severity !== 'undefined' ? severity : 'INFO';

        if (severity == "DEBUG" && !program.debug) {
            return;
        }

        if (program.verbose || program.debug) {
            console.log('['+severity+'] ' + ident + ' ' + msg);
        }

        try { Syslog.log(Syslog.level, '['+severity+'] ' + ident + ' ' + msg); }
        catch (e) { 
            this.init();
            Syslog.log(Syslog.level, '['+severity+'] ' + ident + ' ' + msg);
            this.close();
        }
    },
    "info": function logger (msg, ident) {
        var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

        if (program.verbose || program.debug) {
            console.log('[INFO] ' + ident + ' ' + msg);
        }

        try{ Syslog.log(Syslog.LOG_INFO, '[INFO] ' + ident + ' ' + msg); }
        catch (e) {
            this.init();
            Syslog.log(Syslog.LOG_INFO, '[INFO] ' + ident + ' ' + msg);
            this.close();
        }
    },
    "warn": function logger (msg, ident) {
        var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

        if (program.verbose || program.debug) {
            console.log('[WARN] ' + ident + ' ' + msg);
        }

        try { Syslog.log(Syslog.LOG_INFO, '[WARN] ' + ident + ' ' + msg); }
        catch (e) {
            this.init();
            Syslog.log(Syslog.LOG_INFO, '[WARN] ' + ident + ' ' + msg);
            this.close();
        }
    },
    "err": function logger (msg, ident) {
        var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

        if (program.verbose || program.debug) {
            console.log('[ERROR] ' + ident + ' ' + msg);
        }

        try { Syslog.log(Syslog.LOG_ERR, '[ERROR] ' + ident + ' ' + msg); }
        catch (e) { 
            this.init();
            Syslog.log(Syslog.LOG_ERR, '[ERROR] ' + ident + ' ' + msg);
            this.close();
        }
    },
    "debug": function logger (msg, ident) {
        var ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';

        if (!program.debug) {
            return;
        }

        if (program.verbose || program.debug) {
            console.log('[DEBUG] ' + ident + ' ' + msg);
        }

        try { Syslog.log(Syslog.LOG_DEBUG, '[DEBUG] ' + ident + ' ' + msg); }
        catch (e) {
            this.init();
            Syslog.log(Syslog.LOG_DEBUG, '[DEBUG] ' + ident + ' ' + msg);
            this.close();
        }
    }
};

module.exports = logger;
