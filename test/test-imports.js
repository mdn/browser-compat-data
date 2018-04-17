const fs = require('fs'),
      path = require('path'),
      extend = require('extend'),
      {resolveImports} = require('../process-imports');

// TODO: Consider extracting this function into a separate file too.
function load(...directories) {
  // Recursively load one or more directories passed as arguments.
  var dir, result = {};

  function processFilename(fn) {
    let fp = path.join(dir, fn);
    let extra;

    // If the given filename is a directory, recursively load it.
    if (fs.statSync(fp).isDirectory()) {
      extra = load(fp);
    } else if (path.extname(fp) === '.json') {
      extra = require(fp);
    }

    // The JSON data is independent of the actual file
    // hierarchy, so it is essential to extend "deeply".
    result = extend(true, result, extra);
  }

  for (dir of directories) {
    dir = path.resolve(__dirname, '..', dir);
    if (fs.statSync(dir).isDirectory()) {
      fs.readdirSync(dir).forEach(processFilename);
    } else {
      processFilename('');
    }
  }

  return result;
}

function testImports(...files) {
  const data = load(...files);
  try {
    resolveImports(data);
  } catch (e) {
    console.error(e);
    return true;
  }
  return false;
}

module.exports.testImports = testImports;
