"use strict"
const fs = require('fs');

// creates fake 'fsevents' node module to fix VS errors
if (process.platform === 'win32') {

    let paths = [
        './node_modules/',
        './node_modules/fsevents/',
        './node_modules/fsevents/node_modules/',
        './node_modules/fsevents/node_modules/getpass/',
        './node_modules/fsevents/node_modules/getpass/node_modules/'
    ];
    for (const path of paths) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    fs.writeFileSync('./node_modules/fsevents/package.json', '{"name":"fsevents","version":"1.0.0","os": ["!darwin"]}');
}