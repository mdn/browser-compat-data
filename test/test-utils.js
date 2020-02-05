/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const chalk = require('chalk');
const { escapeInvisibles } = require('./utils.js');

const EXPECTED = [
  /* ␀ */ ['\0', '\\0'],
  /* ␁ */ '\x01',
  /* ␂ */ '\x02',
  /* ␃ */ '\x03',
  /* ␄ */ '\x04',
  /* ␅ */ '\x05',
  /* ␆ */ '\x06',
  /* ␇ */ '\x07',
  /* ␈ */ ['\b', '\\b'],
  /* ␉ */ ['\t', '\\t'],
  /* ␊ */ ['\n', '\\n'],
  /* ␋ */ ['\v', '\\v'],
  /* ␌ */ ['\f', '\\f'],
  /* ␍ */ ['\r', '\\r'],
  /* ␏ */ '\x0F',
  /* ␎ */ '\x0E',
  /* ␐ */ '\x10',
  /* ␑ */ '\x11',
  /* ␒ */ '\x12',
  /* ␓ */ '\x13',
  /* ␔ */ '\x14',
  /* ␕ */ '\x15',
  /* ␖ */ '\x16',
  /* ␗ */ '\x17',
  /* ␘ */ '\x18',
  /* ␙ */ '\x19',
  /* ␚ */ '\x1A',
  /* ␛ */ '\x1B',
  /* ␜ */ '\x1C',
  /* ␝ */ '\x1D',
  /* ␞ */ '\x1E',
  /* ␟ */ '\x1F',
  /* ␠ */ ' ',
  /* ␡ */ '\x7F',
];

/**
 * @todo This test only tests the escapeInvisibles() function in the utilities file, nothing else.
 *
 * @returns {boolean} If the linter utilities aren't functioning properly
 */
const testUtils = () => {
  /** @type {string[]} */
  const errors = [];

  for (const data of EXPECTED) {
    let char, expected;
    if (typeof data === 'string') {
      char = data;
      expected = data;
    } else {
      [char, expected = char] = data;
    }
    if (escapeInvisibles(char) !== expected) {
      errors.push(
        chalk`Character {bold ${escape(char)}} does not get correctly escaped.`,
      );
    }
  }

  if (errors.length) {
    console.error(
      chalk`{red Linter utilities – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (let i in errors) {
      console.error(chalk`{red   ${errors[i]}}`);
    }
    return true;
  }
  return false;
};

module.exports = testUtils;
