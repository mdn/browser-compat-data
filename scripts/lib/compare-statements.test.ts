/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Identifier, CompatStatement } from '../../types/types.js';

import compareStatements from './compare-statements.js';

const tests: { input: Identifier; output: Identifier }[] = [
  {
    input: {
      __compat: {
        support: {
          chrome: [
            { version_added: '20', prefix: 'webkit' },
            {
              version_added: '10',
              version_removed: '18',
              partial_implementation: true,
              notes: 'No fries with the burger',
            },
            {
              version_added: '12',
              flags: [
                {
                  type: 'preference',
                  name: '#add_fries',
                  value_to_set: 'Extra Crispy',
                },
              ],
            },
            { version_added: '20' },
            {
              version_added: '11',
              version_removed: '12',
              prefix: 'moz',
            },
          ],
        },
      },
    },
    output: {
      __compat: {
        support: {
          chrome: [
            { version_added: '20' },
            { version_added: '20', prefix: 'webkit' },
            {
              version_added: '12',
              flags: [
                {
                  type: 'preference',
                  name: '#add_fries',
                  value_to_set: 'Extra Crispy',
                },
              ],
            },
            {
              version_added: '10',
              version_removed: '18',
              partial_implementation: true,
              notes: 'No fries with the burger',
            },
            {
              version_added: '11',
              version_removed: '12',
              prefix: 'moz',
            },
          ],
        },
      },
    },
  },
  {
    input: {
      __compat: {
        support: {
          chrome: [
            { version_added: '20' },
            { version_added: '30' },
            { version_added: '10' },
            { version_added: '40' },
          ],
        },
      },
    },
    output: {
      __compat: {
        support: {
          chrome: [
            { version_added: '40' },
            { version_added: '30' },
            { version_added: '20' },
            { version_added: '10' },
          ],
        },
      },
    },
  },
] as any;

/**
 * Update the order of the statements
 * @param {string} key The key of the object (make sure it's '__compat')
 * @param {CompatStatement} value The compat statement to update
 * @returns {CompatStatement} The updated compat statement
 */
const orderStatements = (
  key: string,
  value: CompatStatement,
): CompatStatement => {
  if (key === '__compat') {
    for (const browser of Object.keys(value.support)) {
      const supportData = value.support[browser];
      if (Array.isArray(supportData)) {
        value.support[browser] = supportData.sort(compareStatements);
      }
    }
  }
  return value;
};

describe('compare-statements script', () => {
  it('`compareStatements()` works correctly', () => {
    for (const test of tests) {
      const expected = test.output;
      const actual = JSON.parse(JSON.stringify(test.output), orderStatements);

      assert.deepStrictEqual(actual, expected);
    }
  });
});
