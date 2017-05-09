var fs = require('fs'),
    path = require('path');

function load(dir, result) {
    var duplicates = [],
        result = result || {};

    dir = path.normalize(dir);

    function processFilename(fn) {
        // If the given filename is a directory, recursively load it.
        var fp = path.join(dir, fn),
            basename = path.parse(fn).name;

        if (result.hasOwnProperty(basename)) {
            // Keep track of the duplicates and throw error later.
            duplicates.push(fp);
        } else if (fs.statSync(fp).isDirectory()) {
            result[basename] = {};
            load(fp, result[basename]);
        } else {
            result[basename] = require(fp);
        }
    }

    fs.readdirSync(dir).forEach(processFilename);

    if (duplicates.length > 0) {
        // Duplicate template names
        throw new Error("duplicates:\n" + duplicates.join("\n"));
    }

    return result;
}

module.exports = {
  api: load('./api'),
  css: load('./css'),
  http: load('./http'),
  javascript: load('./javascript'),
  webextensions: load('./webextensions'),
}
