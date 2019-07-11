#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */

'use strict';
const fs = require('fs');
const path = require('path');

const compareFeatures = (a,b) => {
  if (a == '__compat') return -1;
  if (b == '__compat') return 1;
  
  const wordA = /^[a-zA-Z](\w|-)*$/.test(a);
  const wordB = /^[a-zA-Z](\w|-)*$/.test(b);

  if(wordA && wordB) return a.localeCompare(b, 'en');
  if(wordA || wordB) return (wordA && -1) || 1;
  return 1;
}

function orderFeatures(key, value) {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value).sort(compareFeatures).reduce((result, key) => {
      result[key] = value[key];
      return result;
    }, {});
  }
  return value;
}

 /**
  * @param {Promise<void>} filename 
  */
const fixFeatureOrder = (filename) => {
	let actual   = fs.readFileSync(filename, 'utf-8').trim();
	let expected = JSON.stringify(JSON.parse(actual, orderFeatures), null, 2);

	const platform = require("os").platform;
	if (platform() === "win32") { // prevent false positives from git.core.autocrlf on Windows
		actual   = actual.replace(/\r/g, "");
		expected = expected.replace(/\r/g, "");
	}

	if (actual !== expected) {
		fs.writeFileSync(filename, expected + '\n', 'utf-8');
	}
}

module.exports = fixFeatureOrder;
