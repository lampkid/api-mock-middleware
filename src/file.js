const fs = require('fs'),
    path = require('path'),
    chalk = require('chalk');


function readFileRecursive(dir, cacheMap={}) {
    if (fs.existsSync(dir)) {
        if (fs.statSync(dir).isDirectory()) {
            fs.readdirSync(dir).forEach(function(file) {
            const curPath = dir + "/" + file;
                readFileRecursive(curPath, cacheMap)
            });
        }
        else {
            Object.assign(cacheMap, require(dir));
        }
    }

    return cacheMap;
}

module.exports = readFileRecursive;
