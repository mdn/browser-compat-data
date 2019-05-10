'use strict';
const path = require('path');
const chalk = require('chalk');

function checkPrefix(data, category, errors, prefix, path="") {
  for (var key in data) {
    if (key === "prefix" && typeof(data[key]) === "string") {
      if (data[key].includes(prefix)) {
        var error = chalk`{red.bold ${prefix}}{red  prefix is wrong for key: }{red.bold ${path}}`;
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
    console.error(chalk`{red   Prefix – }{red.bold ${errors.length}}{red  ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testPrefix;
