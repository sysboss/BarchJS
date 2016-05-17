/*
   BarchJS v1.0
   LVM backup solution

   Copyright (c) 2016 Alexey Baikov <sysboss[@]mail.ru>

   An open source LVM backup utility for linux based systems.
   Barch conducts automatic logical volumes structure recognition.
   Supports full/incremental backups. Based on duplicity.
*/

// modules
var tools      = require('./lib/tools.js'),
    program    = require('./lib/usage.js'),
    logger     = require('./lib/logger.js'),
    config     = require('./config.json');

// init logging
logger.init();

// close syslog
logger.close();
