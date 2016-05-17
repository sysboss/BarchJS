// Usage and options helper

var program  = require('commander');
var packinfo = require('../package.json');

// options
program
  .version(packinfo.version)
  .usage("[options] FROM\n")
  .option('-c, --cleanup', 'Recovery mode')
  .option('-n, --dry-run', 'Dry-run mode')
  .option('-v, --verbose', 'Log to stdout')
  .option('--debug', 'Debug mode (very verbose)')
  .option('--syntax', 'Check configuration');

program.on('--help', function(){
  console.log('');
  console.log('  BarchJS v'+packinfo.version+' - '+packinfo.description);
  console.log('  Copyright (c) 2016 '+packinfo.author);
  console.log('');
});

program.parse(process.argv);

module.exports = program;
