/*
   BarchJS v1.0
   LVM backup solution

   Copyright (c) 2016 Alexey Baikov <sysboss[@]mail.ru>

   An open source LVM backup utility for linux based systems.
   Barch conducts automatic and predefined structure recognition.
   Supports full/incremental backups. Based on duplicity.
*/

var version = '1.0';
var welcome = "Barch v"+version+" - LVM Backup Solution";
var prefix  = '_bsnap';

// modules
var fs         = require('fs'),
    sys        = require('sys'),
    path       = require('path'),
    shell      = require('shelljs/global'),
    spawn      = require('child_process').spawn,
    program    = require('commander'),
    Syslog     = require('node-syslog');

// variables set
var config = require('./config.json'),
    child;

// required tools
var tools = ['lvm', 'lvs', 'vgs', 'mount', 'umount', 'duplicity'];

tools.forEach(function(tool) {
    if ( !which(tool) ) {
        console.error('[ERROR] No '+tool+' installed.');
    }
});

// options
program
  .version(version)
  .usage("[options] FROM\n")
  .option('-c, --cleanup', 'Recovery mode')
  .option('-n, --dry-run', 'Dry-run mode')
  .option('-v, --verbose', 'Log to stdout')
  .option('--debug', 'Debug mode (very verbose)')
  .option('--syntax', 'Check configuration');

program.on('--help', function(){
  console.log("\n  " + welcome);
  console.log("  Copyright (c) 2016 Alexey Baikov <sysboss[\@]mail.ru>\n");
});

program.parse(process.argv);

// init logging
Syslog.init("node-syslog", Syslog.LOG_PID | Syslog.LOG_ODELAY, Syslog.LOG_DAEMON);

function logger(msg, severity, ident) {
    var level = typeof severity !== 'undefined' ? 'LOG_'+severity : 'LOG_INFO',
        ident = typeof ident !== 'undefined' ? 'BarchJS-'+ident : 'BarchJS-Main';
    severity = typeof severity !== 'undefined' ? severity : 'INFO';

    if (severity == "DEBUG" && !program.debug) {
        return;
    }

    Syslog.log(Syslog.level, '['+severity+'] ' + ident + ' ' + msg);
}

// executes `pwd`
//child = exec("./longtest.sh", function (error, stdout, stderr) {
//  sys.print('stdout: ' + stdout);
//  sys.print('stderr: ' + stderr);
//  if (error !== null) {
//    console.log('exec error: ' + error);
//  }
//});
// or more concisely
//var sys = require('sys')
//var exec = require('child_process').exec;
//function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("./longtest.sh", puts);

function runCmd(cmd) {
    child = spawn(cmd);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        console.log(data);
    });
}

console.log(welcome);


/*
var interval = setInterval( function () {
    runCmd();
}, 1000);
*/

Syslog.close();
