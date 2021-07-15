#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const compareStatements = require('../scripts/compare-statements');

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

/**
 * A unit test for the compareStatements() function, to ensure that statements are sorted as expected.
 * @returns {boolean} If the sorter isn't functioning properly
 */
const testStatementOrder = () => {
  let errors = false;
  for (let i = 0; i < tests.length; i++) {
    let expected = JSON.stringify(tests[i]['output'], null, 2);
    let output = JSON.stringify(
      JSON.parse(JSON.stringify(tests[i]['input']), orderStatements),
      null,
      2,
    );

    if (output !== expected) {
      console.error(chalk`{red compareStatements() – {bold 1} error:}`);
      console.error(chalk`{red   → Actual and expected orders do not match}`);
      console.error(chalk`{yellow     Actual: {bold ${output}}}`);
      console.error(chalk`{green     Expected: {bold ${expected}}}`);
      return true;
    }
  }

  return false;
};

module.exports = testStatementOrder;
