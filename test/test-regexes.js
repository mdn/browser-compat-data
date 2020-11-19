/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const assert = require('assert');
const chalk = require('chalk');

const { lookup } = require('./utils.js');

/**
 * @typedef {import('../types').Identifier} Identifier
 *
 * @typedef {object} TestCase
 * @property {string[]} features The data to test
 * @property {string[]} matches All regex tests required to match
 * @property {string[]} misses All regex tests required not to match
 */

/** @type {TestCase[]} */
const tests = [
  {
    features: ['css.types.color.alpha_hexadecimal_notation'],
    matches: ['#003399ff', '#0af9'],
    misses: ['#00aaff', '#0af', 'green', '#greenish'],
  },
  {
    features: ['css.properties.transform-origin.three_value_syntax'],
    matches: [
      '2px 30% 10px', // length, percentage, length
      'right bottom -2cm', // two keywords and length
      'calc(50px - 25%) 2px 1px', // lengths with calc
    ],
    misses: [
      'center', // one value syntax
      'left 5px', // two value syntax
      'left calc(10px - 50%)', // two value syntax with calc
    ],
  },
];

/**
 * @todo This test only tests the escapeInvisibles() function in the utilities file, nothing else.
 *
 * @returns {boolean} If the linter utilities aren't functioning properly
 */
const testRegexes = () => {
  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  tests.forEach(({ features, matches, misses }) => {
    features.forEach(featureIdent => {
      const feature = lookup(featureIdent);
      console.log(featureIdent);
      const str =
        feature.__compat.matches.regex_token ||
        feature.__compat.matches.regex_value;
      const regexp = new RegExp(str);

      matches.forEach(match => {
        if (!regexp.test(match)) {
          logger.error(chalk`{bold ${regexp}} did not match {bold ${match}}`);
        }
      });
      misses.forEach(miss => {
        if (regexp.test(miss)) {
          logger.error(
            chalk`{bold ${regexp}} erroneously matched {bold ${miss}}`,
          );
        }
      });
    });
  });

  if (errors.length) {
    console.error(
      chalk`{red Regexes – {bold ${errors.length}} ${
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

module.exports = testRegexes;
