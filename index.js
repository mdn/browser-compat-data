'use strict';
const fs = require('fs');
const path = require('path');

function load(...dirs) {
  const result = {};

  // Traverse directories depth-first by maintaining a stack. Reverse the given
  // dirs so that we pop the first directory first. All subdirectories of that
  // will be pushed to the stack and popped before the next top-level directory
  // is popped. Directory paths on the stack are always relative to __dirname.
  const stack = dirs.reverse();
  while (stack.length) {
    const reldir = stack.pop();
    const absdir = path.resolve(__dirname, reldir);

    const entries = fs.readdirSync(absdir, { withFileTypes: true });
    for (const ent of entries) {
      const relpath = path.join(reldir, ent.name);
      if (ent.isDirectory()) {
        stack.push(relpath);
      } else if (path.extname(ent.name) === '.json') {
        const abspath = path.resolve(__dirname, relpath);
        let data;
        try {
          data = JSON.parse(fs.readFileSync(abspath));
        } catch (e) {
          // Skip invalid JSON. Tests will flag the problem separately.
          continue;
        }
        // The JSON data is independent of the actual file hierarchy, so merge
        // objects as they are into the final object.
        try {
          extend(result, data);
        } catch (e) {
          throw new Error(`While processing ${relpath}: ${e.message}`);
        }
      } else {
        // Skip anything else, such as *~ backup files or similar.
        continue;
      }
    }
  }

  return result;
}

function type(v) {
  if (Array.isArray(v)) {
    return 'array';
  }
  if (v === null) {
    return 'null';
  }
  return typeof v;
}

function extend(target, source, path = null) {
  if (type(target) !== 'object' || type(source) !== 'object') {
    throw new Error(`${path} of target/source type ${type(target)}/${type(source)} cannot be extended, both target and source must be plain objects`);
  }

  // iterate over own enumerable properties
  for (const [key, value] of Object.entries(source)) {
    // recursively extend if target has the same key, otherwise just assign
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      extend(target[key], value, path ? `${path}.${key}` : key);
    } else {
      target[key] = value;
    }
  }
}

module.exports = load(
  'api',
  'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'mathml',
  'svg',
  'webdriver',
  'webextensions',
  'xpath',
  'xslt',
);
