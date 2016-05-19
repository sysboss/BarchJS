/*
   BarchJS v1.0
   LVM backup solution

   Copyright (c) 2016 Alexey Baikov <sysboss[@]mail.ru>

   An open source LVM backup utility for linux based systems.
   Barch conducts automatic logical volumes structure recognition.
   Supports full/incremental backups. Based on duplicity.
*/

// modules
var tools   = require('./lib/tools.js'),
    program = require('./lib/usage.js'),
    logger  = require('./lib/logger.js'),
    config  = require('./lib/config.js');

module.exports.program = program;
module.exports.logger  = logger;
module.exports.config  = config;

// init logging
logger.init();

var lvsTimer = require('./lib/lvs_timer.js');

setInterval( function () {
    console.log(lvsTimer);
}, 1000);

// close syslog
logger.close();
