'use strict';

/**
 * @typedef {object} Logger
 * @property {(...message: unknown[]) => void} error
 */

/** @type {{readonly [char: string]: string}} */
const INVISIBLES_MAP = Object.freeze(
  Object.assign(Object.create(null), {
    '\0': '\\0', // ␀
    '\b': '\\b', // ␈
    '\t': '\\t', // ␉
    '\n': '\\n', // ␊
    '\v': '\\v', // ␋
    '\f': '\\f', // ␌
    '\r': '\\r', // ␍
  })
);
const INVISIBLES_REGEXP = /[\0\x08-\x0D]/g;

/**
 * @param {string} str
 */
function escapeInvisibles(str) {
  // This should now be O(n) instead of O(n*m),
  // where n = string length; m = invisible characters
  return str.replace(INVISIBLES_REGEXP, char => {
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
    let char = str[i];
    switch (char) {
      case '\n':
        if (prevChar === '\r') break;
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
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return `#${i + 1}
    Actual:   ${escapeInvisibles(actualLines[i])}
    Expected: ${escapeInvisibles(expectedLines[i])}`;
    }
  }
}

module.exports = {
  INVISIBLES_MAP,
  escapeInvisibles,
  indexToPosRaw,
  indexToPos,
  jsonDiff,
};
