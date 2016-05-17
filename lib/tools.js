// Tools helper

// required tools
var shell = require('shelljs/global');
var tools = ['lvm', 'lvs', 'vgs', 'mount', 'umount', 'duplicity'];

tools.forEach(function(tool) {
    if ( !which(tool) ) {
        console.error('[ERROR] No '+tool+' installed.');
        exit(1);
    }
});

module.exports = tools;
