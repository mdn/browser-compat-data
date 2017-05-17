var fs = require('fs'),
    path = require('path'),
    extend = require('extend');

function load() {
    // Recursively load one or more directories passed as arguments.

    var dir, result = {};

    function processFilename(fn) {
        var fp = path.join(dir, fn),
            // If the given filename is a directory, recursively load it.
            extra = fs.statSync(fp).isDirectory() ? load(fp) : require(fp);

        // The JSON data is independent of the actual file
        // hierarchy, so it is essential to extend "deeply".
        result = extend(true, result, extra);
    }

    for (dir of arguments) {
        dir = path.resolve(__dirname, dir);
        fs.readdirSync(dir).forEach(processFilename);
    }

    return result;
}

module.exports = load(
    // 'api',
    'css',
    // 'http',
    // 'javascript',
    'webextensions'
);
