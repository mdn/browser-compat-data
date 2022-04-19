#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const compareStatements = require('./compare-statements');

const tests = [
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
          ],
        },
      },
    },
    output: {
      __compat: {
        support: {
          chrome: [
            { version_added: '20' },
            {
              version_added: '10',
              version_removed: '18',
              partial_implementation: true,
              notes: 'No fries with the burger',
            },
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
          ],
        },
      },
    },
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
];

function orderStatements(key, value) {
  if (key === '__compat') {
    for (let browser of Object.keys(value.support)) {
      let supportData = value.support[browser];
      if (Array.isArray(supportData)) {
        value.support[browser] = supportData.sort(compareStatements);
      }
    }
  }
  return value;
}

describe('compare-features script', () => {
  it('`compareFeatures()` works correctly', () => {
    for (const test of tests) {
      let expected = test.output;
      let actual = JSON.parse(JSON.stringify(test.output), orderStatements);

      assert.deepStrictEqual(actual, expected);
    }
  });
});
