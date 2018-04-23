/*
 * clear require cache
 */
function clearCache(modulePath) {
    var module = require.cache[modulePath];
    // remove reference in module.parent
    if (module && module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }

    delete require.cache[require.resolve(modulePath)];
}

module.exports = clearCache;
