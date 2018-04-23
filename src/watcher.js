const fs = require('fs');
const path = require('path');


const chokidar = require('chokidar');

let watcher = 'fs';

module.exports =  {

    with(watcherType) {
        watcher = watcherType;
        return this;
    },

    watch: function (watchPath, callback) {
        if (watcher === 'fs') {
            // fs.watch recursive only works in mac or windows
            fs.watch(watchPath, { recursive: true }, function (eventType, filename) {
                callback.call(this, eventType, path.resolve(watchPath, filename));
            });

        }
        else {
            console.log('watch with chokidar....');
            chokidar.watch(watchPath, {depth: 99}).on('all', callback);
        }


    }
    
}
