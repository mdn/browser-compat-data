#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Return a new "support_block" object whose first-level properties
 * (browser names) have been ordered according to Array.prototype.sort,
 * and so will be stringified in that order as well. This relies on
 * guaranteed "own" property ordering, which is insertion order for
 * non-integer keys (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */

'use strict';
const fs = require('fs');
const path = require('path');

const orderSupportBlock = (key, value) => {
	if (key === "__compat") {
		value.support = Object.keys(value.support).sort().reduce((result, key) => {
			result[key] = value.support[key];
			return result;
		}, {});
	}
	return value;
};

 /**
  * @param {Promise<void>} filename 
  */
const fixBrowserOrder = (filename) => {
	let actual   = fs.readFileSync(filename, 'utf-8').trim();
	let expected = JSON.stringify(JSON.parse(actual, orderSupportBlock), null, 2);

	const platform = require("os").platform;
	if (platform() === "win32") { // prevent false positives from git.core.autocrlf on Windows
		actual   = actual.replace(/\r/g, "");
		expected = expected.replace(/\r/g, "");
	}

	if (actual !== expected) {
		fs.writeFileSync(filename, expected + '\n', 'utf-8');
	}
}

module.exports = fixBrowserOrder;
