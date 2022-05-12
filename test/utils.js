/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

/* eslint no-control-regex: 0 */

const { platform } = require('os');
const chalk = require('chalk');

/** @type {{readonly [char: string]: string}} */
const INVISIBLES_MAP = Object.freeze(
  Object.assign(Object.create(null), {
    '\0': '\\0', // ␀ (0x00)
    '\b': '\\b', // ␈ (0x08)
    '\t': '\\t', // ␉ (0x09)
    '\n': '\\n', // ␊ (0x0A)
    '\v': '\\v', // ␋ (0x0B)
    '\f': '\\f', // ␌ (0x0C)
    '\r': '\\r', // ␍ (0x0D)
  }),
);

const INVISIBLES_REGEXP = /[\0\x08-\x0D]/g;

/** Used to check if the process is running in a CI environment. */
const IS_CI = process.env.CI && String(process.env.CI).toLowerCase() === 'true';

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

/**
 * Escapes common invisible characters.
 *
 * @param {string} str
 */
function escapeInvisibles(str) {
  // This should now be O(n) instead of O(n*m),
  // where n = string length; m = invisible characters
  return INVISIBLES_REGEXP[Symbol.replace](str, (char) => {
    return INVISIBLES_MAP[char] || char;
  });
}

/**
 * Gets the row and column matching the index in a string.
 *
 * @param {string} str
 * @param {number} index
 * @return {[number, number] | [null, null]}
 */
function indexToPosRaw(str, index) {
  let line = 1,
    col = 1;
  let prevChar = null;

  if (
    typeof str !== 'string' ||
    typeof index !== 'number' ||
    index > str.length
  ) {
    return [null, null];
  }

  for (let i = 0; i < index; i++) {
    const char = str[i];
    switch (char) {
      case '\n':
        if (prevChar === '\r') break;
      // eslint-disable-next-line no-fallthrough
      case '\r':
        line++;
        col = 1;
        break;
      case '\t':
        // Use JSON `tab_size` value from `.editorconfig`
        col += 2;
        break;
      default:
        col++;
        break;
    }
    prevChar = char;
  }

  return [line, col];
}

/**
 * Gets the row and column matching the index in a string and formats it.
 *
 * @param {string} str
 * @param {number} index
 * @return {string} The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
function indexToPos(str, index) {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
}

/**
 * @param {string} actual
 * @param {string} expected
 * @return {string}
 */
function jsonDiff(actual, expected) {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return chalk`{bold line #${i + 1}}
    {yellow Actual:   {bold ${escapeInvisibles(actualLines[i])}}}
    {green Expected: {bold ${escapeInvisibles(expectedLines[i])}}}`;
    }
  }
}

module.exports = {
  INVISIBLES_MAP,
  IS_CI,
  IS_WINDOWS,
  escapeInvisibles,
  indexToPosRaw,
  indexToPos,
  jsonDiff,
};
