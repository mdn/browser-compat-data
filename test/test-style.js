'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');
const chalk = require('chalk');
const { platform } = require('os');
const { indexToPos, jsonDiff } = require('./utils.js');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

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
function orderSupportBlock(key, value) {
  if (key === '__compat') {
    value.support = Object.keys(value.support).sort().reduce((result, key) => {
      result[key] = value.support[key];
      return result;
    }, {});
  }
  return value;
}

/**
 * @param {string} filename
 * @param {{error:function(...unknown):void}} logger
 */
function processData(filename, logger) {
  let hasErrors = false;

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  /** @type {import('../types').CompatData} */
  let dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);
  let expectedBrowserSorting = JSON.stringify(dataObject, orderSupportBlock, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
    expectedBrowserSorting = expectedBrowserSorting.replace(/\r/g, '');
  }

  if (actual !== expected) {
    hasErrors = true;
    logger.error(chalk`{red Error on {bold line ${jsonDiff(actual, expected)}}}`);
  }

  if (expected !== expectedBrowserSorting) {
    hasErrors = true;
    logger.error(chalk`{red Browser sorting error on {bold line ${jsonDiff(expected, expectedBrowserSorting)}}}\n{blue     Tip: Run {bold npm run fix} to fix sorting automatically}`);
  }

  let constructorMatch = actual.match(String.raw`"<code>([^)]*?)</code> constructor"`)
  if (constructorMatch) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, constructorMatch.index)} – Use parentheses in constructor description ({yellow ${constructorMatch[1]}} → {green ${constructorMatch[1]}{bold ()}}).}`);
  }

  let hrefDoubleQuoteIndex = actual.indexOf('href=\\"');
  if (hrefDoubleQuoteIndex >= 0) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, hrefDoubleQuoteIndex)} - Found {yellow \\"}, but expected {green \'} for <a href>.}`);
  }

  const regexp = new RegExp(String.raw`<a href='([^'>]+)'>((?:.(?!</a>))*.)</a>`, 'g');
  let match = regexp.exec(actual);
  if (match) {
    var a_url = url.parse(match[1]);
    if (a_url.hostname === null) {
      hasErrors = true;
      logger.error(chalk`{red ${indexToPos(actual, constructorMatch.index)} - Include hostname in URL ({yellow ${match[1]}} → {green {bold https://developer.mozilla.org/}${match[1]}}).}`);
    }
  }

  return hasErrors;
}

function testStyle(filename) {
  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  processData(filename, logger);

  if (errors.length) {
    console.error(chalk`{red   Style – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testStyle;
