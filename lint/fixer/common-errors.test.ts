/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { fixCommonErrorsInCompatStatement } from './common-errors.js';

const tests: { input: any; output?: any }[] = [
  // Replace unwrapped "false".
  {
    input: false,
    output: {
      version_added: false,
    },
  },
  // Replace wrapped "mirror".
  {
    input: {
      version_added: 'mirror',
    },
    output: 'mirror',
  },
];

describe('fix -> common errors', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      const input = {
        support: {
          firefox_android: test.input,
        },
      };
      const output = {
        support: {
          firefox_android: test.output ?? test.input,
        },
      };

      fixCommonErrorsInCompatStatement(input);

      assert.deepStrictEqual(input, output);
    });

    i += 1;
  }
});
