/*
   BarchJS v1.0
   LVM backup solution

   Copyright (c) 2016 Alexey Baikov <sysboss[@]mail.ru>

   An open source LVM backup utility for linux based systems.
   Barch conducts automatic logical volumes structure recognition.
   Supports full/incremental backups. Based on duplicity.
*/

// modules
var tools     = require('./lib/tools.js'),
    program   = require('./lib/usage.js'),
    logger    = require('./lib/logger.js'),
    sizeUtils = require('./lib/size_utils.js'),
    config    = require('./lib/config.js');

// exports
module.exports.program   = program;
module.exports.logger    = logger;
module.exports.config    = config;
module.exports.sizeUtils = sizeUtils;

// init logging
logger.init();

// start core timers
logger.debug("Initialization");

var vgs = require('./lib/vgs_timer.js'),
    lvs = require('./lib/lvs_timer.js');

// close syslog
logger.close();
