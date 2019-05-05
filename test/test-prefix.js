'use strict';
const path = require('path');

function checkPrefix(data, category, errors, prefix, path="") {
  for (var key in data) {
    if (key === "prefix" && typeof(data[key]) === "string") {
      if (data[key].includes(prefix)) {
        var error = `\x1b[31m${prefix} prefix is wrong for key: ${path}\x1b[0m`;
        var rules = [
          category == "api" && !data[key].startsWith(prefix),
          category == "css" && !data[key].startsWith(`-${prefix}`)
        ];
        if (rules.some(x => x === true)) {
          errors.push(error);
        }
      }
    } else {
      if (typeof data[key] === "object") {
        var curr_path = (path.length > 0) ? `${path}.${key}` : key;
        checkPrefix(data[key], category, errors, prefix, curr_path);
      }
    }
  }
  return errors;
}

function processData(data, category) {
  var errors = [];
  var prefixes = [];

  if (category === "api") {
    prefixes = ["moz", "Moz", "webkit", "WebKit", "webKit", "ms", "MS"];
  }
  if (category === "css") {
    prefixes = ["webkit", "moz", "ms"];
  }

  for (let prefix of prefixes) {
    checkPrefix(data, category, errors, prefix);
  }
  return errors;
}

function testPrefix(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filename);
  const category = relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  const data = require(filename);
  var errors = processData(data, category);

  if (errors.length) {
    console.error('\x1b[31m  Prefix –', errors.length, 'error(s):\x1b[0m');
    for (let error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testPrefix;
