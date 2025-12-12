/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { fixCommonErrorsInCompatStatement } from './common-errors.js';

/** @type {{ input: any; output?: any }[]} */
const tests = [
  // Replace unwrapped "false".
  {
    input: {
      firefox_android: false,
    },
    output: {
      firefox_android: { version_added: false },
    },
  },
  // Replace wrapped "mirror".
  {
    input: {
      firefox_android: { version_added: 'mirror' },
    },
    output: { firefox_android: 'mirror' },
  },
  // Remove unnnecessary IE statement.
  {
    input: {
      ie: { version_added: false },
    },
    output: {},
  },
];

describe('fix -> common errors', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      const input = {
        support: test.input,
      };
      const output = {
        support: test.output ?? test.input,
      };

      fixCommonErrorsInCompatStatement(input);

      assert.deepStrictEqual(input, output);
    });

    i += 1;
  }
});
