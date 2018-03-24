var fs = require('fs'),
    path = require('path'),
    extend = require('extend');

function processRefs(obj, fullObj) {
  for (let key in obj) {
    let val = obj[key];
    if (val && val.$ref) {
      val = obj[key] = resolveRefs(fullObj, val);
    }
    if (typeof val === 'object') {
      processRefs(val, fullObj);
    }
  }
  return obj;
}

function resolveRefs(obj, fragmentObj) {
  let fragment = fragmentObj.$ref
  delete fragmentObj.$ref

  if (fragment) {
    let keyPath = fragment.split('.');
    while (keyPath.length) {
      let val = obj[keyPath.shift()];
      if (val) {
        obj =  Object.assign({}, val);
      } else {
        obj = fragment;
        break
      }
    }
  }

  Object.assign(obj, fragmentObj)

  return obj;
}

function load() {
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

  for (dir of arguments) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(processFilename);
  }

  return processRefs(result, result);
}

module.exports = load(
  'api',
  'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'svg',
  'webdriver',
  'webextensions'
);
