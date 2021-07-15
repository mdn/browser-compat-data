/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const assert = require('assert');
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

describe('Regexes in data', () => {
  for (const test of tests) {
    for (const feature of test.features) {
      it(feature, () => {
        const featureData = lookup(feature);
        const regexp = new RegExp(
          featureData.__compat.matches.regex_token ||
            featureData.__compat.matches.regex_value,
        );

        test.matches.forEach(match => {
          assert.strictEqual(
            !!regexp.test(match),
            true,
            `Regex does not match "${match}"`,
          );
        });

        test.misses.forEach(miss => {
          assert.strictEqual(
            !regexp.test(miss),
            true,
            `Regex incorrectly matches "${miss}"`,
          );
        });
      });
    }
  }
});
